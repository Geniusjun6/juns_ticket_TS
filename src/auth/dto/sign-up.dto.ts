import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/users/entities/user-role';

export class SignUpDto {
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상을 입력해야 합니다.' })
  readonly password: string;

  @IsString()
  readonly confirmPassword: string;

  @IsEmail({}, { message: '유효하지 않은 이메일 입니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  readonly email: string;

  @IsEnum(Role, { message: '역할은 admin과 customer에서 골라주세요.' })
  readonly role: Role;
}
