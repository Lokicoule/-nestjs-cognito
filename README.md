<h1 align="center">NestJS-Cognito</h1>

## Description

[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) utilities module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save nestjs-cognito
```

## Configuration

### Options params

```ts
/**
 * @interface CognitoModuleOptions - Options for the CognitoModule
 * @property {string} region - The region
 * @property { accessKeyId: string, secretAccessKey: string, sessionToken: string } credentials - The AWS credentials
 */
export type CognitoModuleOptions = CognitoIdentityProviderClientConfig &
  Required<Pick<CognitoIdentityProviderClientConfig, 'region' | 'credentials'>>;

/**
 * @interface CognitoModuleOptionsFactory - Metadata for the CognitoModule
 * @property {() => Promise<CognitoModuleOptions>} createCognitoModuleOptions - A factory function to create the CognitoModuleOptions
 * @property {Type<any>[]} imports - The imports to be used by the module
 * @property {Provider[]} providers - The providers to be used by the module
 * @property {(string | Provider)[]} exports - The exports to be used by the module
 * @property {string} name - The name of the module
 */
export interface CognitoModuleOptionsFactory {
  createCognitoModuleOptions():
    | Promise<CognitoModuleOptions>
    | CognitoModuleOptions;
}

/**
 * @interface CognitoModuleAsyncOptions - Options for the CognitoModule
 * @property {Function} imports - Imports the module asyncronously
 * @property {Function} inject - Injects the module asyncronously
 * @property {CognitoModuleOptions} useFactory - The factory function to create the CognitoModuleOptions
 * @property {CognitoModuleOptions} useClass - The class to create the CognitoModuleOptions
 * @property {CognitoModuleOptions} useExisting - The existing instance of the CognitoModuleOptions
 * @property {CognitoModuleOptions}
 */
export interface CognitoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CognitoModuleOptionsFactory>;
  useClass?: Type<CognitoModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CognitoModuleOptions> | CognitoModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
```

### Synchronously

Use `CognitoModule.register` method with options of [CognitoModuleOptions interface](#options-params)

```ts
import { CognitoModule } from 'nestjs-cognito';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CognitoModule.register({
      region: 'eu-west-X',
      credentials: {
        accessKeyId: 'XXXXXXXXXXXXXXXXMYFV5',
        secretAccessKey: 'jhXXXXXXxxxxxXXXXXxxxXXXXxxxxxXXXXXTXNGI',
      },
    }),
  ],
})
export class AppModule {}
```

### Asynchronously

With `CognitoModule.registerAsync` you can import your ConfigModule and inject ConfigService to use it in `useFactory` method.
It's also possible to use `useExisting` or `useClass`.
You can find more details [here](https://docs.nestjs.com/techniques/configuration).

Here's an example:

```ts
import { CognitoModule } from 'nestjs-cognito';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CognitoModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get('COGNITO_REGION'),
        credentials: {
          accessKeyId: configService.get<string>('COGNITO_ACCESS_KEY_ID'),
          secretAccessKey: configService.get('COGNITO_SECRET_ACCESS_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Usage

```ts
import { CognitoGuard, CurrentUser } from 'nestjs-cognito';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('cats')
@UseGuards(CognitoGuard)
export class CatsController {
  @Get()
  findAll(@CurrentUser() me: CognitoUser): string {
    return 'This action returns all my cats';
  }
}

@Controller('dogs')
export class DogsController {
  @Get()
  @UseGuards(CognitoGuard)
  findAll(@CurrentUser() me: CognitoUser): string {
    return 'This action returns all my dogs';
  }
}
```

## License

NestJS-Cognito is [MIT licensed](LICENSE).
