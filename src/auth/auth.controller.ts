import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() userInfo: SignUpDto) {
    return this.authService.createNewUser(userInfo);
  }

  @Post('sign-in')
  signIn(@Body() user: SignInDto) {
    return this.authService.signIn(user);
  }
}
