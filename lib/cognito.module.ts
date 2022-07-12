import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
} from './cognito-module.options';
import {
  COGNITO_CLIENT_INSTANCE_TOKEN,
  COGNITO_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from './cognito/cognito.constants';
import { CognitoService } from './cognito/cognito.service';
import {
  getCognitoIdentityProviderClientInstance,
  getCognitoIdentityProviderInstance,
} from './cognito/cognito.utils';
import { ValidatorService } from './validators';

@Module({
  imports: [JwtModule.register({})],
  providers: [ValidatorService, CognitoService],
  exports: [ValidatorService, CognitoService],
})
export class CognitoModule {
  /**
   * @param {CognitoModuleOptions} options - The CognitoModuleOptions
   * @returns {DynamicModule} - The CognitoModule
   */
  static register(options: CognitoModuleOptions): DynamicModule {
    return {
      module: CognitoModule,
      providers: [
        {
          provide: COGNITO_INSTANCE_TOKEN,
          useValue: getCognitoIdentityProviderInstance(options),
        },
        {
          provide: COGNITO_CLIENT_INSTANCE_TOKEN,
          useValue: getCognitoIdentityProviderClientInstance(options),
        },
      ],
      exports: [COGNITO_INSTANCE_TOKEN, COGNITO_CLIENT_INSTANCE_TOKEN],
    };
  }

  /**
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {DynamicModule} - The CognitoModule
   */
  static registerAsync(options: CognitoModuleAsyncOptions): DynamicModule {
    return {
      module: CognitoModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: COGNITO_INSTANCE_TOKEN,
          useFactory: getCognitoIdentityProviderInstance,
          inject: [COGNITO_MODULE_OPTIONS],
        },
        {
          provide: COGNITO_CLIENT_INSTANCE_TOKEN,
          useFactory: getCognitoIdentityProviderClientInstance,
          inject: [COGNITO_MODULE_OPTIONS],
        },

        ...(options.extraProviders || []),
      ],
      exports: [COGNITO_INSTANCE_TOKEN, COGNITO_CLIENT_INSTANCE_TOKEN],
    };
  }

  /**
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {Provider[]} - The providers
   */
  private static createAsyncProviders(
    options: CognitoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  /**
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {Provider} - The provider
   */
  private static createAsyncOptionsProvider(
    options: CognitoModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: COGNITO_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: COGNITO_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CognitoModuleOptionsFactory) =>
        optionsFactory.createCognitoModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
