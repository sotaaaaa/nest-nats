import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NatsOptions } from '@nestjs/microservices';
import { NatsPublishModule } from './publish';

@Module({})
export class NatsCoreModule {
  /**
   * Phục vụ những người không dùng với nest-core
   * Lưu ý: Nếu dùng với nest-core thì không dùng hàm này
   * @param options
   * @returns
   */
  static forRoot(options: NatsOptions['options']): DynamicModule {
    return {
      module: NatsCoreModule,
      imports: [NatsPublishModule.register(options)],
    };
  }

  /**
   * Phục vụ những người dùng kết hợp với thư viện nest-core
   * Các config lúc này sẽ được load từ một chỗ
   */
  static forPlugin(): DynamicModule {
    return {
      module: NatsCoreModule,
      providers: [ConfigService],
      imports: [NatsPublishModule.registerAsync()],
    };
  }
}
