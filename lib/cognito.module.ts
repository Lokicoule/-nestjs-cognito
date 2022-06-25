import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import {
  COGNITO_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from './constants/cognito.constants';
import { CognitoService } from './services/cognito.service';
import {
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
} from './interfaces/cognito-module.interface';

@Module({
  providers: [CognitoService],
  exports: [CognitoService],
})
export class CognitoModule {
  /**
   * @param {CognitoModuleOptions} options - The CognitoModuleOptions
   * @returns {DynamicModule} - The CognitoModule
   * @static
   * @memberof CognitoModule
   */
  static register(config: CognitoModuleOptions): DynamicModule {
    return {
      module: CognitoModule,
      providers: [
        {
          provide: COGNITO_INSTANCE_TOKEN,
          useValue: new CognitoIdentityProvider({
            region: config.region,
            credentials: config.credentials,
          }),
        },
      ],
      exports: [COGNITO_INSTANCE_TOKEN],
    };
  }

  /**
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {DynamicModule} - The CognitoModule
   * @static
   * @memberof CognitoModule
   */
  static registerAsync(options: CognitoModuleAsyncOptions): DynamicModule {
    const logger = new Logger(CognitoModule.name);

    return {
      module: CognitoModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: COGNITO_INSTANCE_TOKEN,
          useFactory: async (config: CognitoModuleOptions) => {
            if (!Boolean(config.region)) {
              logger.warn('CognitoModule: region is missing. ');
            }
            if (!Boolean(config.credentials)) {
              logger.warn('CognitoModule: credentials are missing.');
            }
            return new CognitoIdentityProvider({
              region: config.region,
              credentials: config.credentials,
            });
          },
          inject: [COGNITO_MODULE_OPTIONS],
        },
        ...(options.extraProviders || []),
      ],
      exports: [COGNITO_INSTANCE_TOKEN],
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
