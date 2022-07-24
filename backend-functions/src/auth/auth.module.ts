import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GraphqlModule } from 'src/graphql/graphql.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthGateWay } from './auth.gateway';
import { AuthService } from './auth.service';
import { AtStagegy } from './stagegies';

@Module({
  imports: [UsersModule, JwtModule.register({ secret: 'at-secret' })],
  controllers: [AuthController],
  providers: [AuthService, AuthGateWay, AtStagegy],
})
export class AuthModule {}
