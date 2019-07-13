import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get('/buy')
    buy() {
        console.log('Buy!');
        return this.ordersService.buy('ZRX');
    }
}