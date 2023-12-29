import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { Performance } from './entities/performance.entity';

import { Roles } from 'src/utils/role.decorator';
import { Role, User } from 'src/users/entities/user.entity';
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
  async findAll(): Promise<Performance[]> {
    const performances: Performance[] =
      await this.performancesService.findAll();
    return performances;
  }

  /* 특정 공연 가져오기 (id) */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const performance: Performance = await this.performancesService.findOne(id);

    return performance;
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePerformanceDto: UpdatePerformanceDto,
  ) {
    return this.performancesService.update(+id, updatePerformanceDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.performancesService.remove(+id);
  }
}
