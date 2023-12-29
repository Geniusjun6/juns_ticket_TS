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
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/utils/role.decorator';
import { Role } from 'src/users/entities/user.entity';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post(':performanceId')
  async create(
    @Body() createSeatDto: CreateSeatDto,
    @Param('performanceId') performanceId: number,
  ) {
    await this.seatsService.create(createSeatDto, performanceId);

    return {
      success: 'true',
      message: '좌석 등록에 성공했습니다.',
    };
  }

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatsService.update(+id, updateSeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatsService.remove(+id);
  }
}
