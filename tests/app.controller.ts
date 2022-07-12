import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  Authentication,
  AuthenticationGuard,
  Authorization,
  AuthorizationGuard,
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
  getPrivateHello() {
    return this.appService.getPrivateMessage();
  }

  @Get('admin')
  @UseGuards(AuthorizationGuard(['admin']))
  getAdminHello() {
    return this.appService.getPrivateMessage();
  }

  @Get('no-admin')
  @UseGuards(
    AuthorizationGuard({
      prohibitedGroups: ['admin'],
    }),
  )
  getNoAdminHello() {
    return this.appService.getPrivateMessage();
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
  getAdminHello() {
    return this.appService.getPrivateMessage();
  }
}

@Controller()
@Authorization({
  allowedGroups: ['admin'],
})
export class AppWithAuthorizationDecoratorController {
  constructor(private readonly appService: AppService) {}
  @Get('authorization-decorator')
  getAdminHello() {
    return this.appService.getPrivateMessage();
  }
}
