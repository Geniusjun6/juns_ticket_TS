import {
  Contains,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  Validator,
} from 'class-validator';

enum Role {
  'admin',
  'customer',
}

export class SignUpDto {
  @IsString()
  readonly name: string;

  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상을 입력해야 합니다.' })
  readonly password: string;

  @IsString()
  readonly confirmPassword: string;

  @IsEmail({}, { message: '유효하지 않은 이메일 입니다.' })
  readonly email: string;

  @IsEnum(Role, { message: '역할은 admin과 customer에서 골라주세요.' })
  readonly role: Role;
}
