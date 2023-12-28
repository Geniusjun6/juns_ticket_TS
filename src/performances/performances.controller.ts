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

import { Roles } from 'src/utils/role.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(
    @Body() createPerformanceDto: CreatePerformanceDto,
    @UserInfo() user: User,
  ) {
    return {
      success: 'true',
      message: this.performancesService.create(createPerformanceDto, user.id),
    };
  }

  @Get()
  findAll() {
    return this.performancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performancesService.findOne(+id);
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
