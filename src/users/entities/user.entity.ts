import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Role {
  'admin',
  'customer',
}

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
  @Column('varchar', { length: 255, nullable: false })
  email: string;

  @IsNumber()
  @Column('int', { nullable: false, default: 1000000 })
  point: number;

  @IsEnum(Role)
  @Column('varchar', { nullable: false })
  role: Role;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;
}
