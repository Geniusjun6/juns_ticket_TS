import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { Repository } from 'typeorm';
import { PerformancesService } from 'src/performances/performances.service';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    private readonly performanceService: PerformancesService,
  ) {}

  async create(createSeatDto: CreateSeatDto, performanceId: number) {
    const performance =
      await this.performanceService.findOneById(performanceId);

    const existingSeat = await this.seatRepository.findOne({
      where: {
        zone: createSeatDto.zone,
        seatNumber: createSeatDto.seatNumber,
      },
    });

    if (existingSeat) {
      throw new BadRequestException('이미 추가된 좌석이 있습니다.');
    }

    await this.seatRepository.save({
      ...createSeatDto,
      performanceId: performance.id,
    });
  }

  findAll() {
    return `This action returns all seats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seat`;
  }

  update(id: number, updateSeatDto: UpdateSeatDto) {
    return `This action updates a #${id} seat`;
  }

  remove(id: number) {
    return `This action removes a #${id} seat`;
  }
}
