import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // 레포지토리 생성
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(userData: SignUpDto) {
    const { name, password, confirmPassword, email, role } = userData;

    // 입력받은 password와 confirmPassword 가 다를 경우 에러 반환
    if (password !== confirmPassword) {
      throw new BadRequestException('비밀번호를 확인해주세요');
    }

    if (await this.findUserByEmail(email)) {
      throw new BadRequestException('이미 존재하는 이메일 입니다.');
    }

    // 입력받은 Password를 해쉬화
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser: User = await this.userRepository.save({
      name,
      password: hashedPassword,
      email,
      role,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      point: newUser.point,
      role: newUser.role,
    };
  }

  signIn(user: SignInDto) {
    return `Sign-In user`;
  }

  async findUserByEmail(email): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return false;
    }

    return true;
  }
}
