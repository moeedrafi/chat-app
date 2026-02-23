import type { Response, Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDTO } from 'src/auth/dtos/login.dto';
import { RegisterDTO } from 'src/auth/dtos/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ResetPasswordDTO } from 'src/auth/dtos/reset-password.dto';
import { ForgotPasswordDTO } from 'src/auth/dtos/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/me')
  me(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('/signup')
  signUp(@Body() body: RegisterDTO) {
    return this.authService.signUp(
      body.email,
      body.password,
      body.name,
      body.isAdmin,
    );
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.signIn(
      body.email,
      body.password,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return {
      data: user,
      message: 'Successfully SignedIn',
    };
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies['refresh_token'] as string;
    if (!oldRefreshToken) throw new UnauthorizedException();

    const { accessToken, refreshToken } =
      await this.authService.refreshAccessToken(oldRefreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return { message: 'Tokens refreshed' };
  }

  @Post('/signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('/forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('/reset-password')
  resetPassword(@Query('token') token: string, @Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(
      token,
      body.password,
      body.confirmPassword,
    );
  }
}
