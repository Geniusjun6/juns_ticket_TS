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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/utils/role.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Seat } from './entities/seat.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  /* 좌석 1개씩 등록하기 */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post(':performanceId')
  async create(
    @Body() createSeatDto: CreateSeatDto,
    @Param('performanceId') performanceId: number,
    @UserInfo() user: User,
  ) {
    await this.seatsService.create(createSeatDto, performanceId, user.id);

    return {
      success: 'true',
      message: '좌석 등록에 성공했습니다.',
    };
  }

  /* 좌석 CSV 로 등록하기 */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('file/:performanceId')
  @UseInterceptors(FileInterceptor('file'))
  async createSeatByFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('performanceId') performanceId: number,
    @UserInfo() user: User,
  ) {
    await this.seatsService.createSeatByFile(file, performanceId, user.id);

    return {
      success: 'true',
      message: '좌석 등록에 성공했습니다.',
    };
  }

  /* 모든 좌석 조회하기(공연별) */
  @Get()
  async findAll(@Query('performance') performanceId: number) {
    const seats: Seat[] = await this.seatsService.findAllSeats(performanceId);
    return {
      success: 'true',
      message: '좌석 조회에 성공했습니다.',
      data: seats,
    };
  }

  /* 특정 좌석 조회하기 */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const seat: Seat = await this.seatsService.findOne(id);

    return {
      success: 'true',
      message: '좌석 조회에 성공했습니다.',
      data: seat,
    };
  }

  /* 좌석 상태 수정하기 */
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: number) {
    await this.seatsService.update(id);

    return {
      success: 'true',
      message: '좌석 수정에 성공했습니다.',
    };
  }

  /* 좌석 삭제하기 */
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @UserInfo() user: User) {
    await this.seatsService.remove(id, user.id);

    return {
      success: 'true',
      message: '좌석 삭제에 성공했습니다.',
    };
  }
}
