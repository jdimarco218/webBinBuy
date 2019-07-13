import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import * as config from '../config/keys';

const allowed_tickers: string[] = config.default.allowed_tickers;

@Injectable()
export class PollService {
    Twitter: any;
    client: any;
    params: any;
    constructor(private readonly ordersService: OrdersService) {
        this.Twitter = require('twitter');
        this.client = new this.Twitter({
            consumer_key: config.default.consumer_key,
            consumer_secret: config.default.consumer_secret,
            access_token_key: config.default.access_token_key,
            access_token_secret: config.default.access_token_secret
        })

        this.params = { screen_name: config.default.homeTimelineScreenName, count: '1', since_id: config.default.since_id };
    }

    startPoll(): string {
        return 'Starting Poll!';
    }

    stopPoll(): string {
        return 'Stopping Poll!';
    }

    startMailPoll(): string {
        return 'Starting Mail Poll!';
    }

    stopMailPoll(): string {
        return 'Stopping Mail Poll!';
    }

    setSinceId(newSinceId): void {
        this.params.since_id = newSinceId;
    }

    poll(): void {
        var that = this;
        this.client.get('statuses/user_timeline', this.params, function (error, tweets, response) {
            if (!error) {
                if (tweets[0] && tweets[0].text) {
                    const tweetText = tweets[0].text;
                    const ticker = tweetText.slice(1, tweetText.indexOf(' '));
                    if (allowed_tickers.indexOf(ticker) > -1 && tweetText.indexOf('Buy') > -1) {
                        console.log("BUY SIGNAL!!!! [" + ticker + "]");
                        console.log("tweet id: " + tweets[0].id);
                        that.setSinceId(tweets[0].id + 10000);
                        that.ordersService.buy(ticker);
                    }
                }
            } else {
                console.log('Error: ' + error);
            }
        })
    }

    pollMail(): void {
        //var that = this;
        //this.client.post('statuses/user_timeline', this.params, function (error, tweets, response) {
        //    if (!error) {
        //        if (tweets[0] && tweets[0].text) {
        //            const tweetText = tweets[0].text;
        //            const ticker = tweetText.slice(1, tweetText.indexOf(' '));
        //            if (allowed_tickers.indexOf(ticker) > -1 && tweetText.indexOf('Buy') > -1) {
        //                console.log("BUY SIGNAL!!!! [" + ticker + "]");
        //                console.log("tweet id: " + tweets[0].id);
        //                that.setSinceId(tweets[0].id + 10000);
        //                that.ordersService.buy(ticker);
        //            }
        //        }
        //    } else {
        //        console.log('Error: ' + error);
        //    }
        //})
    }
}
