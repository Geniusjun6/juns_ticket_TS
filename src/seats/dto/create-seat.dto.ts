import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SeatStatus } from '../entities/seat-status';

export class CreateSeatDto {
  @IsString()
  @IsNotEmpty({ message: '구역을 입력해주세요.' })
  readonly zone: string;

  @IsNumber()
  @IsNotEmpty({ message: '좌석을 입력해주세요' })
  readonly seatNumber: number;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요' })
  readonly price: number;

  @IsEnum(SeatStatus)
  readonly status?: SeatStatus;
}
