import {
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
    private readonly seatsService: SeatsService,
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

    let totalPrice = 0;
    //total Price 구하기
    for (const seatId of seatIds) {
      const seat = await this.seatsService.findOne(seatId);

      totalPrice += seat.price;
    }

    let newReservationId = 0;
    /* 트랜잭션 시작 */
    const reservationTransaction = await this.entityManager.transaction(
      'READ COMMITTED',
      async (transactionEntityManager) => {
        const reservation: Reservation = transactionEntityManager.create(
          Reservation,
          {
            userId,
            performanceId,
            numbers,
          },
        );

        // 2. 예약 추가
        reservation.totalPrice = totalPrice;
        const newReservation = await transactionEntityManager.save(reservation);

        newReservationId = newReservation.id;

        // 1. 좌석 상태값 변경 및 전체 금액 확인

        for (const seatId of seatIds) {
          const seat = await transactionEntityManager
            .createQueryBuilder(Seat, 'seat')
            .setLock('pessimistic_write') // 동시성 처리를 위한 Lock 설정
            .where('seat.id = :id', { id: seatId })
            .getOne();

          if (seat.status !== SeatStatus.Possible) {
            throw new BadRequestException(
              `${seat.zone}-${seat.seatNumber} 좌석은 이미 예약이 있습니다.`,
            );
          }

          await transactionEntityManager.update(
            Seat,
            { id: seatId },
            {
              status: SeatStatus.Complete,
              reservationId: newReservationId,
            },
          );
        }

        // 3. 유저 포인트 차감
        const user: User = await transactionEntityManager.findOne(User, {
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundException('예약하는 유저를 찾을 수 없습니다.');
        }

        const calculatePoint: number = user.point - totalPrice;

        if (calculatePoint < 0) {
          throw new BadRequestException('보유하신 포인트가 부족합니다.');
        }

        await transactionEntityManager.update(
          User,
          { id: userId },
          { point: calculatePoint },
        );
      },
    );

    const reservationInfo = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.performance', 'performance')
      .select([
        'reservation.id',
        'seat.zone',
        'seat.seatNumber',
        'performance.title',
        'performance.startTime',
        'performance.endTime',
      ])
      .where('reservation.id=:id', { id: newReservationId })
      .getOne();

    return reservationInfo;
  }
}
