import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NastClientInstance, NastInstance } from '@sotaaaaa/nest-nats';
import { MessagePattern, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // setInterval(() => {
    //   this.natsInstance.emit('test', Date.now());
    //   console.log('Emit completed');
    // }, 1000);
  }
}
