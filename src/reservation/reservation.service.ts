import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { ReservationStatus } from './entities/reservation-status';

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
    await this.entityManager.transaction(
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

    const reservationInfo: Reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.performance', 'performance')
      .select([
        'reservation.id',
        'reservation.totalPrice',
        'seat.zone',
        'seat.seatNumber',
        'seat.price',
        'performance.title',
        'performance.startTime',
        'performance.endTime',
      ])
      .where('reservation.id=:id', { id: newReservationId })
      .getOne();

    return reservationInfo;
  }

  async findAll(userId: number) {
    const reservations: Reservation[] = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.performance', 'performance')
      .select([
        'reservation.id',
        'reservation.totalPrice',
        'reservation.createdAt',
        'reservation.numbers',
        'seat.zone',
        'seat.seatNumber',
        'seat.price',
        'performance.title',
        'performance.startTime',
        'performance.endTime',
      ])
      .where('reservation.userId=:id', { id: userId })
      .orderBy('reservation.createdAt', 'DESC')
      .getMany();

    return reservations;
  }

  async remove(id: number, userId: number) {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.performance', 'performance')
      .select([
        'reservation.id',
        'reservation.totalPrice',
        'performance.startTime',
      ])
      .where('reservation.id=:id', { id })
      .getOne();

    if (!reservation) {
      throw new NotFoundException('해당하는 예약을 찾을 수 없습니다.');
    }

    const startTime = new Date(reservation.performance.startTime);
    startTime.setHours(startTime.getHours() + 9);

    // 현재 시간 (KST)
    const now = new Date();
    now.setHours(now.getHours() + 9); // 현재 시간을 KST로 변환

    if (startTime.getTime() - now.getTime() < 3 * 60 * 60 * 1000) {
      throw new BadRequestException(
        '예약 시작 3시간 전에는 취소가 불가능합니다.',
      );
    }

    /* 트랜잭션 시작 */
    await this.entityManager.transaction(
      'READ COMMITTED',
      async (transactionEntityManager) => {
        try {
          // 1. 예약 삭제
          await transactionEntityManager.softDelete(Reservation, { id });

          await transactionEntityManager.update(
            Reservation,
            { id },
            { status: ReservationStatus.Cancled },
          );

          // 2. user 포인트 환불
          const user = await transactionEntityManager.findOne(User, {
            where: { id: userId },
          });

          const refundPoint: number = reservation.totalPrice;
          await transactionEntityManager.update(
            User,
            { id: userId },
            { point: user.point + refundPoint },
          );

          // 3. 좌석 상태 변경
          await transactionEntityManager.update(
            Seat,
            { reservationId: reservation.id },
            {
              status: SeatStatus.Possible,
              reservationId: null,
            },
          );
        } catch (err) {
          throw err;
        }
      },
    );
  }
}
