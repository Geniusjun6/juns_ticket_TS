import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { SeatStatus } from './seat-status';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Performance } from 'src/performances/entities/performance.entity';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Entity()
@Unique(['zone', 'seatNumber', 'performanceId'])
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  performanceId: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  userId: number;

  @IsNumber()
  @Column({ type: 'int', nullable: true })
  reservationId?: number;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  zone: string;

  @IsNumber()
  @Column({ type: 'int', nullable: true })
  seatNumber: number;

  @IsNumber()
  @Column({ type: 'int', nullable: true })
  price: number;

  @IsEnum(SeatStatus)
  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.Possible })
  status: SeatStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @ManyToOne(() => Performance, (performance) => performance.seat, {
    onDelete: 'CASCADE',
  })
  performance: Performance;

  @ManyToOne(() => User, (user) => user.seat, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Reservation, (reservation) => reservation.seat, {
    onDelete: 'SET NULL',
  })
  reservation: Reservation;
}
