import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    // 레포지토리 생성
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createNewUser(userData: SignUpDto) {
    return 'This action adds a new auth';
  }

  signIn(user: SignInDto) {
    return `Sign-In user`;
  }
}
