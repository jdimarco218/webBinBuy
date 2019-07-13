import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { isNullOrUndefined, isNull } from 'util';
import * as config from '../config/keys';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get('/buy')
    buy(@Query() query) {
        console.log('Buy triggered!');
        if (isNullOrUndefined(query.symbol) ||
            isNullOrUndefined(query.percentage) ||
            isNullOrUndefined(query.secretPhrase)) {
            console.log("Error, missing query parameters");
            return;
        }
        if (query.secretPhrase != config.default.entrySecret) {
            console.log("Error, incorrect secret phrase!");
            return;
        }
        console.log('Params: ' + query.symbol + ', ' + query.percentage);
        return this.ordersService.buy(query.symbol, query.percentage);
    }
}