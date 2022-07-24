import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserGateway],
  exports: [UserGateway],
})
export class UsersModule {}
