import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticationGuard, AuthorizationGuard } from '../lib';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('public')
  getHello() {
    console.log('getHello');
    return this.appService.getHello();
  }

  @Get('private')
  @UseGuards(AuthenticationGuard)
  getPrivateHello() {
    console.debug('-----');
    console.debug('----');
    console.debug('----');
    console.debug('getPrivateHello');
    console.debug('-----');
    console.debug('----');
    console.debug('----');
    return this.appService.getPrivateMessage();
  }

  @Get('admin')
  @UseGuards(AuthorizationGuard(['admin']))
  getAdminHello() {
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
