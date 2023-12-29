import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { PerformancesModule } from 'src/performances/performances.module';

@Module({
  controllers: [SeatsController],
  providers: [SeatsService],
  imports: [TypeOrmModule.forFeature([Seat]), PerformancesModule],
})
export class SeatsModule {}
