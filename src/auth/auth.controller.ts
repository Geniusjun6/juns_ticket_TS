import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() userInfo: SignUpDto) {
    const user = await this.authService.signUp(userInfo);
    return {
      success: 'true',
      message: '회원가입에 성공했습니다.',
      data: user,
    };
  }

  @Post('/sign-in')
  signIn(@Body() user: SignInDto) {
    return this.authService.signIn(user);
  }
}
