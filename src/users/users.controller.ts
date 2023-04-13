import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<void> {
    return await this.usersService.createUser(payload);
  }
}
