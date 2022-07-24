import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/signIn.dto';
import { SignUpDto } from './dtos/SignUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/users')
  getUsers() {
    return;
  }
  @Post('/signin')
  signIn(@Body() request) {
    //const body = request.input.body as AuthDto;
    const body = request as AuthDto;
    return this.authService.signIn(body);
  }

  @Post('/signup')
  signUp(@Body() request) {
    const input = request.input.body as SignUpDto;
    return this.authService.signUp(input);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshToken() {
    return this.authService.refreshToken();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Request() request) {
    const user = request.user;
    console.log(user);
    return this.authService.logout(user['sub']);
  }
}
