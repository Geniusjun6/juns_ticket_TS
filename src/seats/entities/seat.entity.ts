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

@Entity()
@Unique(['zone', 'seatNumber', 'performanceId'])
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  performanceId: number;

  @IsString()
  @Column()
  zone: string;

  @IsNumber()
  @Column()
  seatNumber: number;

  @IsNumber()
  @Column()
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
}
