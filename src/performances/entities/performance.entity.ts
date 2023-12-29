import { IsDate, IsString, IsNumber } from 'class-validator';
import { Seat } from 'src/seats/entities/seat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar', { length: 100, nullable: false })
  title: string;

  @IsDate()
  @Column('datetime', { nullable: false })
  startTime: Date;

  @IsDate()
  @Column('datetime', { nullable: false })
  endTime: Date;

  @IsString({ each: true })
  @Column('simple-array', { nullable: false })
  genres: string[];

  @IsString()
  @Column('varchar', { length: 255, nullable: false })
  overView: string;

  @Column('int')
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt?: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.performance, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Seat, (seat) => seat.performance)
  seat: Seat[];
}
