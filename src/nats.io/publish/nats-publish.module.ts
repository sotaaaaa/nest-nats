import { DynamicModule, Global, Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, NatsOptions, Transport } from '@nestjs/microservices';
import { NATS_PUBLISH_EXCEC } from '../constants';
import { NatsPublishService } from './nats-publish.service';

@Global()
@Module({})
export class NatsPublishModule {
  static registerAsync(): DynamicModule {
    const imports = [
      ClientsModule.registerAsync([
        {
          inject: [ConfigService],
          name: NATS_PUBLISH_EXCEC,
          useFactory: async (configService: ConfigService) => {
            const options = configService.get('transporters.nats.options');
            const enable = configService.get('transporters.nats.enable');

            if (!enable) {
              Logger.log(`[Nest-nats] Nats not enable`);
              return null;
            }

            return {
              transport: Transport.NATS,
              options: options,
            };
          },
        },
      ]),
    ];

    return {
      module: NatsPublishModule,
      providers: [NatsPublishService],
      exports: [NatsPublishService],
      imports: imports,
    };
  }

  static register(options: NatsOptions['options']): DynamicModule {
    const imports = [
      ClientsModule.registerAsync([
        {
          name: NATS_PUBLISH_EXCEC,
          useFactory: async () => ({
            transport: Transport.NATS,
            options: options,
          }),
        },
      ]),
    ];

    return {
      module: NatsPublishModule,
      providers: [NatsPublishService],
      exports: [NatsPublishService],
      imports: imports,
    };
  }
}
