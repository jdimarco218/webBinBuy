import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { OrdersService } from '../orders/orders.service';

@Module({
  providers: [PollService, OrdersService]
})
export class PollModule {}
