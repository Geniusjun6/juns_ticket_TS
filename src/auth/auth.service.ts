import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // 레포지토리 생성
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(singUpDto: SignUpDto): Promise<Partial<User>> {
    const { name, password, confirmPassword, email, role } = singUpDto;

    // 입력받은 password와 confirmPassword 가 다를 경우 에러 반환
    if (password !== confirmPassword) {
      throw new BadRequestException('비밀번호를 확인해주세요');
    }

    if (await this.findUserByEmail(email)) {
      throw new ConflictException('이미 존재하는 이메일 입니다.');
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

  async signIn(signInDto: SignInDto): Promise<string> {
    const { email, password } = signInDto;

    const user = await this.findUserByEmail(email);

    // 입력받은 이메일로 유저를 찾지 못했을 경우 에러 반환
    // 입력받은 비밀번호가 DB에 저장된 비밀번호와 다를 경우 에러 반환
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('이메일 또는 비밀번호를 확인해주세요.');
    }

    const token: string = this.jwtService.sign({
      id: user.id,
      email: user.email,
      point: user.point,
      name: user.name,
      role: user.role,
    });

    return token;
  }

  async findUserByEmail(email: User['email']): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'name', 'password', 'role', 'point'],
      where: { email },
    });

    return user;
  }
}
