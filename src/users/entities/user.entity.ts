import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Performance } from 'src/performances/entities/performance.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Role } from './user-role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @IsString()
  @Column('varchar', { length: 500, nullable: false, select: false })
  password: string;

  @IsEmail()
  @Column('varchar', { length: 255, nullable: false, unique: true })
  email: string;

  @IsNumber()
  @Column('int', { nullable: false, default: 1000000 })
  point: number;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, nullable: false })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @OneToMany(() => Performance, (performance) => performance.user)
  performance: Performance[];

  @OneToMany(() => Seat, (seat) => seat.user)
  seat: Seat[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];
}
