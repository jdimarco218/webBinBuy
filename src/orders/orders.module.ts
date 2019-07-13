import { Module, HttpModule } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Module({
    imports: [HttpModule],
    providers: [OrdersService],
})
export class OrdersModule { }
