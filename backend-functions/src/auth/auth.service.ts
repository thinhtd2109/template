import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dtos/signIn.dto';
import { SignUpDto } from './dtos/SignUp.dto';
import * as bcrypt from 'bcrypt';
import { AuthGateWay } from './auth.gateway';
import { JwtService } from '@nestjs/jwt';
import { UserGateway } from '../users/users.gateway';
import { of } from 'rxjs';
import { UpdateInputDto } from './dtos/User.dto';

@Injectable()
export class AuthService {
  constructor(
    private authGateWay: AuthGateWay,
    private jwtService: JwtService,
    private userGateway: UserGateway,
  ) {}
  hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
  async signIn(input: AuthDto) {
    const user = await this.userGateway.findUserByEmail(input.email);

    if (!user) {
      throw new BadRequestException('Access denied.');
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user[0].password,
    );

    if (!passwordMatches) throw new BadRequestException('Access denied.');

    const tokens = await this.getToken(user[0].id, user[0].email);

    await this.updateRefreshToken(user[0].id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
  async signUp(input: SignUpDto): Promise<unknown> {
    const userExist = await this.userGateway.findUserByEmail(input.email);

    if (userExist) {
      throw new BadRequestException('User is already exist.');
    }
    const password = await this.hashPassword(input.password);

    const newUser = await this.authGateWay.createUser({
      email: input.email,
      password,
    });

    const tokens = await this.getToken(newUser.id, newUser.email);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async updateRefreshToken(userId: string, token: string) {
    const hash = await this.hashPassword(token);

    await this.authGateWay.updateUser(userId, { hash_refresh_token: hash });
  }
  async getToken(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      { expiresIn: 60 * 5 },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: 60 * 60 * 24 * 7,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  refreshToken() {}
  async logout(userId: string) {
    await this.authGateWay.updateUser(userId, { hash_refresh_token: null });
    return {
      code: 200,
      message: 'Logout Successfully.',
    };
  }
}
