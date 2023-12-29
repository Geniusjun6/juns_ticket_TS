import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';

@Injectable()
export class PerformancesService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
  ) {}

  async create(createPerformanceDto: CreatePerformanceDto, userId: number) {
    const { title, startTime, endTime, genres, overView } =
      createPerformanceDto;

    await this.performanceRepository.save({
      title,
      startTime,
      endTime,
      genres,
      overView,
      userId,
    });

    return '공연 등록이 완료되었습니다.';
  }

  async findAll(): Promise<Performance[]> {
    const performances: Performance[] = await this.performanceRepository.find();

    return performances;
  }

  async findOne(id: number) {
    const performance: Performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException('해당하는 공연을 찾을 수 없습니다.');
    }

    return performance;
  }

  update(id: number, updatePerformanceDto: UpdatePerformanceDto) {
    return `This action updates a #${id} performance`;
  }

  remove(id: number) {
    return `This action removes a #${id} performance`;
  }
}
