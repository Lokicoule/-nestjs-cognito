import { Module } from '@nestjs/common';
import { CognitoModule } from '../lib/cognito.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AppController],
  imports: [
    CognitoModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get('COGNITO_REGION'),
        UserPoolId: configService.get('COGNITO_USER_POOL_ID'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AppService, ConfigService],
})
export class AppModule {}
