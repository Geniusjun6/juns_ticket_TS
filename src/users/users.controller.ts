import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* 내 정보 조회하기 */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async findMyInfoByMyId(@UserInfo() user: User) {
    return await this.usersService.findOneById(user.id);
  }
}
