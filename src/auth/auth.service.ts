import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './interface/login-res.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginRes> {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const access_token = await this.createAccessToken(user);

    return { access_token, refresh_token: '' };
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }
}
