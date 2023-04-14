import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginRes } from './interface/login-res.interface';
import { RefreshTokenRes } from './interface/refresh-token-res.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<RefreshTokenRes> {
    return this.authService.refreshAccessToken(refreshAccessTokenDto);
  }
}
