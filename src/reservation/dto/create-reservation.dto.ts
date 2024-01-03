import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNumber({}, { each: true })
  @IsNotEmpty({ message: '좌석을 선택해주세요.' })
  readonly seatIds: number[];

  @IsNumber()
  @IsNotEmpty({ message: '인원수를 입력해주세요.' })
  readonly numbers: number;
}
