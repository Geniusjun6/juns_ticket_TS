import { IsDate, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt?: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;
}
