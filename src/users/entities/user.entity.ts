import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  admin,
  customer,
}
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
  @Column('varchar', { nullable: false })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;
}
