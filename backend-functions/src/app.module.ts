import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { GraphqlService } from './graphql/graphql.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphqlModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60d' },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, GraphqlService],
})
export class AppModule {}
