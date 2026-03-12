import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes, createHash, randomUUID } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private isPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private hashing(data: string, saltRounds = 10) {
    return bcrypt.hash(data, saltRounds);
  }

  async getTokens(id: number) {
    const refreshTokenId = randomUUID();

    const accessPayload = { sub: id };
    const refreshPayload = { sub: id, jti: refreshTokenId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signUp(
    email: string,
    password: string,
    name: string,
    isAdmin: boolean,
  ) {
    const user = await this.userService.findOne(email);
    if (user) throw new ConflictException('User already exists');

    const hashedPassword = await this.hashing(password);

    // TODO: Send email verification

    const createdUser = await this.userService.create(
      email,
      hashedPassword,
      name,
    );

    return {
      data: createdUser,
      message: 'Successfully SignedUp',
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) throw new UnauthorizedException('Invalid user');

    // TODO: Check email verified

    const isCorrect = await this.isPasswordMatch(password, user.password);
    if (!isCorrect) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id);
    const hashedRefreshToken = await this.hashing(tokens.refreshToken, 12);
    await this.userService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      ...tokens,
      user: {
        email: user.email,
        username: user.username,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // 1️⃣ verify token
      const payload: { sub: number; jti: string } =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });

      // 2️⃣ fetch user + hashed refresh token
      const user = await this.userService.findById(payload.sub, {
        select: ['refreshToken'],
      });
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      // 3️⃣ compare hash
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException();

      // 4️⃣ generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.getTokens(user.id);

      // 5️⃣ hash new refresh token and save
      const hashed = await this.hashing(newRefreshToken);
      await this.userService.update(user.id, { refreshToken: hashed });

      // 6️⃣ return new tokens
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException(`Invalid or expired refresh token`);
    }
  }

  async forgotPassword(email: string) {
    const existingUser = await this.userService.findOne(email);
    if (!existingUser) throw new NotFoundException('user not found');

    const rawToken = randomBytes(26).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    await this.userService.update(existingUser.id, {
      resetToken: tokenHash,
      resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 10),
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    await this.mailService.sendMail({
      from: this.configService.get<string>('SENDER_EMAIL'),
      to: existingUser.email,
      subject: `Reset your Assessly Password`,
      html: `
        <p>Welcome! Please open this link and create a new password:</p>
          <a href="${frontendUrl}/reset-password?token=${rawToken}">
          Reset your password
          </a>
        `,
    });

    return { message: 'Check your email for reset password' };
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword)
      throw new BadRequestException('Password dont match');

    const hashedToken = createHash('sha256').update(token).digest('hex');
    const user = await this.userService.findByResetToken(hashedToken);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashing(password);

    await this.userService.update(user.id, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return { message: 'Password Successfully Updated' };
  }
}
