import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './interface/login-res.interface';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refereshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginRes> {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);

    return { access_token, refresh_token };
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
}
