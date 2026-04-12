import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = request.cookies?.access_token;
    const refreshToken = request.cookies?.refresh_token;

    if (!accessToken && !refreshToken) throw new UnauthorizedException();

    if (accessToken) {
      try {
        const payload = await this.jwtService.verifyAsync(accessToken);
        request.user = payload;
        return true;
      } catch {
        // access token expired or invalid, fall through to refresh
      }
    }

    // ✅ Attempt refresh
    if (!refreshToken) throw new UnauthorizedException();

    let payload: { sub: number };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(); // refresh token expired or tampered
    }

    const user = await this.userService.findById(payload.sub, {
      select: ['id', 'refreshToken'],
    });

    if (!user?.refreshToken) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException();

    // ✅ Issue new tokens
    const { accessToken: newAccess, refreshToken: newRefresh } =
      await this.authService.getTokens(payload.sub);

    // ✅ Save new hashed refresh token to DB
    await this.userService.updateRefreshToken(
      payload.sub,
      await bcrypt.hash(newRefresh, 10),
    );

    // ✅ Set new cookies on the response
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict' as const,
      secure: this.configService.get('NODE_ENV') === 'production',
    };

    response.cookie('access_token', newAccess, cookieOptions);
    response.cookie('refresh_token', newRefresh, cookieOptions);

    request.user = payload;

    return true;
  }
}
