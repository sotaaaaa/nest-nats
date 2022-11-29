import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { NATS_PUBLISH_EXCEC } from '../constants';
import { NatsPublishOptions, RequestNats } from './types';

@Injectable()
export class NatsPublishService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  protected readonly timeout: number;

  constructor(
    private configService: ConfigService,

    @Inject(NATS_PUBLISH_EXCEC)
    private readonly clientNats: ClientNats,
  ) {
    this.timeout = this.configService.get('transporters.nats.timeout') || 10000;
  }

  /**
   * Connect đến nats server
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.clientNats.connect().then(() => {
      Logger.log('[Nest-nats] Nats server connected');
    });
  }

  async send<O = any, I = any>(
    event: string,
    data: I,
    options?: NatsPublishOptions,
  ): Promise<O> {
    try {
      options = options || {};

      const timeout =
        this.configService.get('transporters.nats.timeout') || 10000;
      const request: RequestNats<I> = {
        key: uuidv4(),
        value: data,
        headers: options?.headers ? options.headers : undefined,
        context: options?.context ? options.context : undefined,
      };

      const message: O = await firstValueFrom(
        this.clientNats
          .send<any, RequestNats<I>>(event, request)
          .pipe(timeout(timeout)),
      );

      return message;
    } catch (error) {
      Logger.error(`[Nest-nats] Send error message ${event}`, data);
      throw new ServiceUnavailableException(`Service ${event} unavailable!`);
    }
  }

  async emit<I = any>(event: string, data: I, options?: NatsPublishOptions) {
    options = options || {};

    const request: RequestNats<I> = {
      key: uuidv4(),
      value: data,
      headers: options?.headers ? options.headers : undefined,
      context: options?.context ? options.context : undefined,
    };

    const emited = await firstValueFrom(
      this.clientNats
        .emit<any, RequestNats<I>>(event, request)
        .pipe(timeout(this.timeout)),
    );

    return emited;
  }

  async onModuleDestroy(): Promise<void> {
    await this.clientNats.close();
  }
}
