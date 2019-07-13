import { Injectable } from '@nestjs/common';
import * as config from '../config/keys';
const crypto = require('crypto');
const axios = require('axios');

@Injectable()
export class OrdersService {
    constructor() { }

    buy(symbol) {
        //
        // First get the inside price
        //
        const tickerPriceUrl = `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}BTC`;
        const headers =
        {
            'X-MBX-APIKEY': config.default.binApiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        axios.get(tickerPriceUrl, null, {headers: headers}).then(tickerRes => {

            var qtyToBuy = 0;
            if (tickerRes.data && tickerRes.data.askPrice) {
                // In case the price has moved up, let's only use 92% of our btc
                qtyToBuy = Math.floor(config.default.btcBalance / tickerRes.data.askPrice * 0.92);
            }

            //
            // Now create the buy order
            //
            const baseTradeUrl = 'https://api.binance.com/api/v3/order/test';

            //
            // Create query string
            //
            const baseQueryString = `quantity=${qtyToBuy}&recvWindow=10000&symbol=${symbol}BTC&side=BUY&type=MARKET&timestamp=${(new Date).getTime()}`;
            const hmac = crypto.createHmac('sha256', config.default.binSecretKey);
            hmac.update(baseQueryString);
            const digest = hmac.digest('hex');
            const signatureParam = `&signature=${digest}`;
            const queryString = baseQueryString + signatureParam;

            const fullUrl = baseTradeUrl + '?' + queryString;

            console.log("POST to: " + fullUrl);
            return axios.post(fullUrl, null, {
                headers: headers
            }).then(res => {
                console.log("Post successful.");
                return res.status;
            }).catch(e => {
                console.log(e);
            });
        }).catch(e => {
            console.log(e);
        })

    }
}
