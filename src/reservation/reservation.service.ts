import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { EntityManager, Repository } from 'typeorm';
import { SeatsService } from 'src/seats/seats.service';
import { SeatStatus } from 'src/seats/entities/seat-status';
import { User } from 'src/users/entities/user.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly usersService: UsersService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    performanceId: number,
    userId: number,
  ) {
    const { seatIds, numbers } = createReservationDto;
    if (seatIds.length !== numbers) {
      throw new BadRequestException('인원수에 맞게 좌석을 선택해야 합니다.');
    }

    const reservation: Reservation = this.reservationRepository.create({
      userId,
      performanceId,
      numbers,
    });

    /* 트랜잭션 시작 */
    const newReservation = await this.entityManager.transaction(
      'READ COMMITTED',
      async (transactionEntityManager) => {
        // 1. 좌석 상태값 변경 및 전체 금액 확인
        let totalPrice = 0;
        for (const seatId of seatIds) {
          const seat = await transactionEntityManager.findOne(Seat, {
            where: { id: seatId },
          });
          if (seat.status !== SeatStatus.Possible) {
            throw new BadRequestException(
              `${seat.zone}-${seat.seatNumber} 좌석은 이미 예약이 있습니다.`,
            );
          }

          totalPrice += seat.price;

          await transactionEntityManager.update(
            Seat,
            { id: seatId },
            {
              status: SeatStatus.Complete,
              reservationId: reservation.id,
            },
          );
        }

        // 2. 예약 추가
        reservation.totalPrice = totalPrice;
        const newReservation = await transactionEntityManager.save(reservation);

        // 3. 유저 포인트 차감
        const user: User = await transactionEntityManager.findOne(User, {
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundException('예약하는 유저를 찾을 수 없습니다.');
        }

        const calculatePoint: number = user.point - totalPrice;

        if (calculatePoint < 0) {
          throw new BadGatewayException('보유하신 포인트가 부족합니다.');
        }

        await transactionEntityManager.update(
          User,
          { id: userId },
          { point: calculatePoint },
        );

        return newReservation;
      },
    );

    return newReservation;
  }

  findAll() {
    return `This action returns all reservation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
