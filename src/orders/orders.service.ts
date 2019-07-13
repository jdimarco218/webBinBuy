import { Injectable } from '@nestjs/common';
import * as config from '../config/keys';
import { isNullOrUndefined } from 'util';
const crypto = require('crypto');
const axios = require('axios');

@Injectable()
export class OrdersService {
    constructor() { }

    //
    // We will buy the symbol with a percentage of the currently held BTC
    //
    buy(symbol, percentage) {

        //
        // The first task is to get our current BTC balance
        //
        const accountUrlBase = `https://api.binance.com/api/v3/account`;
        const headers =
        {
            'X-MBX-APIKEY': config.default.binApiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const baseQueryStringAccount = `timestamp=${(new Date).getTime()}`;
        const hmacAccount = crypto.createHmac('sha256', config.default.binSecretKey);
        hmacAccount.update(baseQueryStringAccount);
        const digestAccount = hmacAccount.digest('hex');
        const signatureParamAccount = `&signature=${digestAccount}`;
        const queryStringAccount = baseQueryStringAccount + signatureParamAccount;

        const fullUrlAccount = accountUrlBase + '?' + queryStringAccount;
        console.log(`fullUrlAccount: ${fullUrlAccount}`);

        axios.get(fullUrlAccount, { headers: headers }).then(accountRes => {

            if (accountRes.data && accountRes.data.balances) {
                var balanceDesired = accountRes.data.balances.find(bal => {
                    return bal["asset"] === "BTC";
                });
                if (isNullOrUndefined(balanceDesired)) {
                    console.log(`Couldn't get account balance for BTC during buy entry`);
                    return;
                }
                balanceDesired = balanceDesired.free
                console.log(`Balance of BTC ${balanceDesired}`);
            }
            console.log("Done getting account balances.");

            //
            // For order entry, First get the inside price
            //
            const tickerPriceUrl = `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}BTC`;
            axios.get(tickerPriceUrl, null, { headers: headers }).then(tickerRes => {

                var qtyToBuy = 0;
                if (tickerRes.data && tickerRes.data.askPrice) {
                    qtyToBuy = Math.floor(balanceDesired / tickerRes.data.askPrice * (percentage / 100));
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
            return;
        }).catch(e => {
            console.log(e);
        })


    }

    //
    // We will sell the percentage of the given symbol against BTC
    //
    sell(symbol, percentage) {

        //
        // The first task is to get our current symbol balance
        //
        const accountUrlBase = `https://api.binance.com/api/v3/account`;
        const headers =
        {
            'X-MBX-APIKEY': config.default.binApiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const baseQueryStringAccount = `timestamp=${(new Date).getTime()}`;
        const hmacAccount = crypto.createHmac('sha256', config.default.binSecretKey);
        hmacAccount.update(baseQueryStringAccount);
        const digestAccount = hmacAccount.digest('hex');
        const signatureParamAccount = `&signature=${digestAccount}`;
        const queryStringAccount = baseQueryStringAccount + signatureParamAccount;

        const fullUrlAccount = accountUrlBase + '?' + queryStringAccount;
        console.log(`fullUrlAccount: ${fullUrlAccount}`);

        axios.get(fullUrlAccount, { headers: headers }).then(accountRes => {

            if (accountRes.data && accountRes.data.balances) {
                var balanceDesired = accountRes.data.balances.find(bal => {
                    return bal["asset"] === symbol;
                });
                if (isNullOrUndefined(balanceDesired)) {
                    console.log(`Couldn't get account balance for ${symbol} during buy entry`);
                    return;
                }
                balanceDesired = balanceDesired.free
                console.log(`Balance of ${symbol}: ${balanceDesired}`);
            }
            console.log("Done getting account balances.");

            //
            // For order entry, First get the inside price
            //
            const tickerPriceUrl = `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}BTC`;
            axios.get(tickerPriceUrl, null, { headers: headers }).then(tickerRes => {

                var qtyToSell = 0;
                if (tickerRes.data && tickerRes.data.askPrice) {
                    qtyToSell = Math.floor(balanceDesired / tickerRes.data.bidPrice * (percentage / 100));
                }
                console.log(`qtyToSell: ${qtyToSell}`);

                //
                // Now create the buy order
                //
                const baseTradeUrl = 'https://api.binance.com/api/v3/order/test';

                //
                // Create query string
                //
                const baseQueryString = `quantity=${qtyToSell}&recvWindow=10000&symbol=${symbol}BTC&side=SELL&type=MARKET&timestamp=${(new Date).getTime()}`;
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
            return;
        }).catch(e => {
            console.log(e);
        })


    }
}
