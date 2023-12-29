import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { Repository } from 'typeorm';
import { PerformancesService } from 'src/performances/performances.service';
import { parse } from 'papaparse';

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
        performanceId,
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

  async createSeatByFile(file: Express.Multer.File, performanceId: number) {
    const performance =
      await this.performanceService.findOneById(performanceId);

    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('CSV 파일만 업로드가 가능합니다.');
    }

    const csvContent = file.buffer.toString();

    let parseResult;
    try {
      parseResult = parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('CSV 파싱에 실패했습니다.');
    }

    const seatsDatas = parseResult.data as any[];

    for (const seatData of seatsDatas) {
      if (
        !seatData.zone ||
        !seatData.seatNumber ||
        !seatData.price ||
        !seatData.status
      ) {
        throw new BadRequestException(
          'CSV파일의 컬럼은 zone, seatNumber, price, status를 포함해야 합니다.',
        );
      }

      const existingSeat = await this.seatRepository.findOne({
        where: {
          performanceId: performance.id,
          zone: seatData.zone,
          seatNumber: seatData.seatNumber,
        },
      });

      if (existingSeat) {
        throw new BadRequestException(
          `이미 존재하는 좌석입니다: ${seatData.zone}-${seatData.seatNumber}`,
        );
      }
    }

    const createSeatDto = seatsDatas.map((seat) => ({
      zone: seat.zone,
      seatNumber: +seat.seatNumber,
      price: +seat.price,
      status: seat.status,
      performanceId: performance.id,
    }));

    await this.seatRepository.save(createSeatDto);
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
