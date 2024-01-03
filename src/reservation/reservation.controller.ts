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
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/user-role';
import { Roles } from 'src/utils/role.decorator';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Customer)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Query('performance') performanceId: number,
    @UserInfo() user: User,
  ) {
    const reservation = await this.reservationService.create(
      createReservationDto,
      performanceId,
      user.id,
    );
    return {
      success: 'true',
      message: '예약에 성공했습니다.',
      data: reservation,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserInfo() user: User) {
    const reservations = await this.reservationService.findAll(user.id);
    return {
      success: 'true',
      message: '예약 조회에 성공했습니다.',
      data: reservations,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserInfo() user: User) {
    await this.reservationService.remove(id, user.id);
    return {
      success: 'true',
      message: '예약 취소에 성공했습니다.',
    };
  }
}
