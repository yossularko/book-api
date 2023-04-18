import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';
import { AuthService } from './auth.service';
import { LoginQueryDto } from './dto/login-query.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginRes } from './interface/login-res.interface';
import { RefreshTokenRes } from './interface/refresh-token-res.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Query() params: LoginQueryDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginRes> {
    const { isMobile } = params;
    return this.authService.login(loginDto, isMobile, response);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
    @Query() params: LoginQueryDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenRes> {
    const { isMobile } = params;
    return this.authService.refreshAccessToken(
      refreshAccessTokenDto,
      isMobile,
      response,
    );
  }

  @Patch('/:id/revoke')
  @UseGuards(JwtGuard)
  async revokeRefreshToken(@Param('id') id: string): Promise<void> {
    return this.authService.revokeRefreshToken(id);
  }
}
