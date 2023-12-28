import { Module } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';

@Module({
  controllers: [PerformancesController],
  providers: [PerformancesService],
  imports: [TypeOrmModule.forFeature([Performance])],
})
export class PerformancesModule {}
