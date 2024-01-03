import { IsEnum, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from './reservation-status';
import { User } from 'src/users/entities/user.entity';
import { Performance } from 'src/performances/entities/performance.entity';
import { Seat } from 'src/seats/entities/seat.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  userId: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  performanceId: number;

  @IsEnum(ReservationStatus)
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    nullable: false,
    default: ReservationStatus.Reserved,
  })
  status: ReservationStatus;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  totalPrice: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  numbers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt?: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.reservation, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Performance, (performance) => performance.reservation, {
    onDelete: 'CASCADE',
  })
  performance: Performance;

  @OneToMany(() => Seat, (seat) => seat.reservation)
  seat: Seat[];
}
