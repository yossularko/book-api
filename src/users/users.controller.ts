import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<void> {
    return await this.usersService.createUser(payload);
  }
}
