import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'superrahasia',
  signOptions: {
    expiresIn: 60,
  },
};
