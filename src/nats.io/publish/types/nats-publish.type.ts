import { ModuleMetadata, Type } from '@nestjs/common';
import { NatsOptions } from '@nestjs/microservices';

export interface NatsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<any>;
  useClass?: Type<any>;
  useFactory?: (...args: any[]) => Promise<NatsOptions['options']>;
  inject?: any[];
}

export type NatsHeaders = {
  [key in string]: any;
};

export type NatsContext = {
  [key in string]: any;
};

export interface NatsPublishOptions {
  headers?: NatsHeaders;
  context?: NatsContext;
}

export interface RequestNats<T = Record<string, string>> {
  key: string;
  value: T;
  headers?: NatsHeaders;
  context?: NatsContext;
}

export interface NastInstance {
  send<O = any, I = any>(
    event: string,
    data: I,
    options?: NatsPublishOptions,
  ): Promise<O>;

  emit<I = any>(event: string, data: I, options?: NatsPublishOptions): void;
}
