import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // default find cookie ===================================
          if (request && request.cookies) {
            return request.cookies['jwt_auth'];
          }

          // find cookie without cookie-parser ==============================
          // if (request && request.headers.cookie) {
          //   const jwtCookie = request.headers.cookie;
          //   const splited = jwtCookie.split(';');
          //   const idx = splited.findIndex((item) => item.includes('jwt_auth'));
          //   if (idx !== -1) {
          //     const finded = splited[idx];
          //     const nameVal = finded.indexOf('=');
          //     const finalCookie = finded.substring(nameVal + 1, finded.length);
          //     return finalCookie;
          //   }
          // }

          // check bearer
          if (request && request.headers.authorization) {
            const bearer = request.headers.authorization;
            if (bearer.includes('Bearer')) {
              const split = bearer.split(' ');
              return split[1];
            }
          }

          return null;
        },
      ]),
      ignoreExpiration: false, // production must be false
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User is not found!');
    }

    return user;
  }
}
