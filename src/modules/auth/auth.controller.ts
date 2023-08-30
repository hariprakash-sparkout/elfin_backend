import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<any> {
    const { username, password } = body;
    return await this.authService.register(username, password);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<any> {
    const { username, password } = body;
    const data = await this.authService.login(username, password);
    return data;
  }
}
