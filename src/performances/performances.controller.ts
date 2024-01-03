import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { Performance } from './entities/performance.entity';

import { Roles } from 'src/utils/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/user-role';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  /* 공연 등록 */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() createPerformanceDto: CreatePerformanceDto,
    @UserInfo() user: User,
  ) {
    await this.performancesService.create(createPerformanceDto, user.id);
    return {
      success: 'true',
      message: '공연 등록에 성공했습니다.',
    };
  }

  /* 모든 공연 가져오기 */
  @Get()
  async findAll() {
    const performances: Performance[] =
      await this.performancesService.findAll();
    return {
      success: 'true',
      message: '공연 조회에 성공했습니다.',
      data: performances,
    };
  }

  /* 특정 공연 가져오기 'Keyword') */
  @Get('search')
  async findByKeyword(@Query('keyword') keyword: string) {
    const performances: Performance[] =
      await this.performancesService.findByKeyword(keyword);

    return {
      success: 'true',
      message: '공연 조회에 성공했습니다.',
      data: performances,
    };
  }

  /* 특정 공연 가져오기 (id) */
  @Get(':id')
  async findOneById(@Param('id') id: number) {
    const performance: Performance =
      await this.performancesService.findOneById(id);

    return {
      success: 'true',
      message: '공연 조회에 성공했습니다.',
      data: performance,
    };
  }

  /* 특정 공연 수정하기 */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePerformanceDto: UpdatePerformanceDto,
    @UserInfo() user: User,
  ) {
    await this.performancesService.update(id, updatePerformanceDto, user.id);

    return {
      success: 'true',
      message: '공연 수정에 성공했습니다.',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: number, @UserInfo() user: User) {
    await this.performancesService.remove(id, user.id);
    return {
      success: 'true',
      message: '공연 삭제에 성공했습니다.',
    };
  }
}
