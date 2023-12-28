import { IsDate, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty({ message: '타이틀을 입력해주세요.' })
  readonly title: string;

  @IsDateString()
  @IsNotEmpty({ message: '시작 시간을 입력해주세요' })
  readonly startTime: Date;

  @IsDateString()
  @IsNotEmpty({ message: '종료 시간을 입력해주세요' })
  readonly endTime: Date;

  @IsString({ each: true })
  @IsNotEmpty()
  readonly genres: string[];

  @IsString()
  @IsNotEmpty()
  readonly overView: string;
}
