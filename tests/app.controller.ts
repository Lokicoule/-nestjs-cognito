import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  Authentication,
  AuthenticationGuard,
  Authorization,
  AuthorizationGuard,
  CurrentUser,
  User,
} from '../lib';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('public')
  getHello() {
    return this.appService.getHello();
  }

  @Get('private')
  @UseGuards(AuthenticationGuard)
  getPrivateHello(@CurrentUser() me: User) {
    return this.appService.getPrivateMessage(me);
  }

  @Get('admin')
  @UseGuards(AuthorizationGuard(['admin']))
  getAdminHello(@CurrentUser() me: User) {
    return this.appService.getPrivateMessage(me);
  }

  @Get('no-admin')
  @UseGuards(
    AuthorizationGuard({
      prohibitedGroups: ['admin'],
    }),
  )
  getNoAdminHello(@CurrentUser() me: User) {
    return this.appService.getPrivateMessage(me);
  }

  @Post('login')
  login(@Body() body: Record<string, string>) {
    return this.appService.getAccessToken({
      username: body.username,
      password: body.password,
    });
  }
}

@Controller()
@Authentication()
export class AppWithAuthenticationDecoratorController {
  constructor(private readonly appService: AppService) {}
  @Get('authentication-decorator')
  getAdminHello(@CurrentUser() me: User) {
    return this.appService.getPrivateMessage(me);
  }
}

@Controller()
@Authorization({
  allowedGroups: ['admin'],
})
export class AppWithAuthorizationDecoratorController {
  constructor(private readonly appService: AppService) {}
  @Get('authorization-decorator')
  getAdminHello(@CurrentUser() me: User) {
    return this.appService.getPrivateMessage(me);
  }
}
