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
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role, User } from 'src/users/entities/user.entity';
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reservationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReservationDto: UpdateReservationDto,
  // ) {
  //   return this.reservationService.update(+id, updateReservationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reservationService.remove(+id);
  // }
}
