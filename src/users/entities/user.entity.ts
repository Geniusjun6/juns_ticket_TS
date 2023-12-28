import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
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

export enum Role {
  Admin = 'Admin',
  Customer = 'Customer',
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

  @OneToMany(() => Performance, (performance) => performance.user)
  performance: Performance[];
}
