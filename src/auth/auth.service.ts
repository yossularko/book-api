import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginRes } from './interface/login-res.interface';
import { RefreshTokenRes } from './interface/refresh-token-res.interface';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { TokenExpiredError } from 'jsonwebtoken';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refereshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(loginDto: LoginDto, response: Response): Promise<LoginRes> {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);

    response.cookie('jwt_auth', access_token, {
      expires: new Date(new Date().getTime() + 3600 * 1000),
      httpOnly: true,
      sameSite: 'strict',
    });

    return { refresh_token };
  }

  async refreshAccessToken(
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<RefreshTokenRes> {
    const { refresh_token } = refreshAccessTokenDto;
    const payload = await this.decodeToken(refresh_token);
    const refreshToken = await this.refereshTokenRepository.findOne({
      where: { id: payload.jid },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not found');
    }

    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const access_token = await this.createAccessToken(refreshToken.user);

    return { access_token };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is expired!');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }

  async createRefreshToken(user: User): Promise<string> {
    const refreshToken = await this.refereshTokenRepository.createRefreshToken(
      user,
      +refreshTokenConfig.expiresIn,
    );

    const payload = { jid: refreshToken.id };

    const refresh_token = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );

    return refresh_token;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    const refreshToken = await this.refereshTokenRepository.findOne({
      where: { id },
    });

    if (!refreshToken) {
      throw new NotFoundException('Refresh token is not found!');
    }

    refreshToken.isRevoked = true;
    await refreshToken.save();
  }
}
