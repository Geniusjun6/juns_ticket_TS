import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() userInfo: SignUpDto): Promise<object> {
    const user = await this.authService.signUp(userInfo);
    return {
      success: 'true',
      message: '회원가입에 성공했습니다.',
      data: user,
    };
  }

  @Post('/sign-in')
  async signIn(@Body() signInInfo: SignInDto): Promise<object> {
    const token = await this.authService.signIn(signInInfo);
    return {
      success: 'true',
      message: '로그인에 성공했습니다.',
      token,
    };
  }
}
