import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientNats, ClientNatsService } from '@sotaaaaa/nest-nats';
import { MessagePattern, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
