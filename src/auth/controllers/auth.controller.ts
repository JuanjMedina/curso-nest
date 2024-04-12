import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthBody } from '../interfaces/auth.interfaces';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() { password, username }: AuthDto) {
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );

    if (!userValidate) throw new UnauthorizedException('Data no valida');
    const jwt = await this.authService.generateJWT(userValidate);
    return jwt;
  }
}
