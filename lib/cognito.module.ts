import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
} from './cognito-module.options';
import {
  COGNITO_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
  COGNITO_USER_POOL_ID,
} from './cognito/cognito.constants';
import { CognitoService } from './cognito/cognito.service';
import {
  getCognitoIdentityProviderValue,
  getUserPoolIdProviderValue,
} from './cognito/cognito.utils';
import { ValidatorService } from './validators';

@Global()
@Module({
  providers: [ValidatorService, CognitoService],
  exports: [ValidatorService, CognitoService],
})
export class CognitoModule {
  /**
   * @param {CognitoModuleOptions} options - The CognitoModuleOptions
   * @returns {DynamicModule} - The CognitoModule
   * @static
   * @memberof CognitoModule
   */
  static register(options: CognitoModuleOptions): DynamicModule {
    return {
      module: CognitoModule,
      providers: [
        {
          provide: COGNITO_INSTANCE_TOKEN,
          useValue: getCognitoIdentityProviderValue(options),
        },
        {
          provide: COGNITO_USER_POOL_ID,
          useValue: getUserPoolIdProviderValue(options),
        },
      ],
      exports: [COGNITO_INSTANCE_TOKEN, COGNITO_USER_POOL_ID],
    };
  }

  /**
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {DynamicModule} - The CognitoModule
   * @static
   * @memberof CognitoModule
   */
  static registerAsync(options: CognitoModuleAsyncOptions): DynamicModule {
    return {
      module: CognitoModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: COGNITO_INSTANCE_TOKEN,
          useFactory: getCognitoIdentityProviderValue,
          inject: [COGNITO_MODULE_OPTIONS],
        },
        {
          provide: COGNITO_USER_POOL_ID,
          useFactory: getUserPoolIdProviderValue,
          inject: [COGNITO_MODULE_OPTIONS],
        },
        ...(options.extraProviders || []),
      ],
      exports: [COGNITO_INSTANCE_TOKEN, COGNITO_USER_POOL_ID],
    };
  }

  /**
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {Provider[]} - The providers
   * @private
   * @static
   * @memberof CognitoModule
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
   * @private
   * @static
   * @memberof CognitoModule
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
