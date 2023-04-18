import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    isArray: true,
    type: UserDto,
  })
  @Get()
  @UseGuards(JwtGuard)
  async getUsers(): Promise<User[]> {
    const users = await this.usersService.getUsers();
    const finalData = users.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
    }));
    return finalData as User[];
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<void> {
    return await this.usersService.createUser(payload);
  }
}
