import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { SeatsModule } from 'src/seats/seats.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [TypeOrmModule.forFeature([Reservation]), SeatsModule, UsersModule],
})
export class ReservationModule {}
