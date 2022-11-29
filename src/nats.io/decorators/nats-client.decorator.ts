import { Inject } from '@nestjs/common';
import { NatsPublishService } from '../publish';

export function ClientNats(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(NatsPublishService);
}
