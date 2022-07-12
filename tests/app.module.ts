import { Module } from '@nestjs/common';
import { CognitoModule } from '../lib/cognito.module';
import {
  AppController,
  AppWithAuthenticationDecoratorController,
  AppWithAuthorizationDecoratorController,
} from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [
    AppController,
    AppWithAuthenticationDecoratorController,
    AppWithAuthorizationDecoratorController,
  ],
  imports: [
    CognitoModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get('COGNITO_REGION'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AppService, ConfigService],
})
export class AppModule {}
