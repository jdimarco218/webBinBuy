import { Controller, Get, Post } from '@nestjs/common';
import { PollService } from './poll.service';

@Controller('poll')
export class PollController {
    isPolling: boolean;
    isMailPolling: boolean;
    constructor(private readonly pollService: PollService) {
        this.isPolling = false;
        this.isMailPolling = false;
        var timer = setInterval(() => {
            if (this.isPolling) {
                this.pollService.poll();
            }
            if (this.isMailPolling) {
                this.pollService.pollMail();
            }
        }, 1100);
    }

    @Get('/start')
    startPoll(): string {
        console.log('Starting poll');
        this.isPolling = true;
        return this.pollService.startPoll();
    }

    @Get('/stop')
    stopPoll(): string {
        console.log('Stopping poll');
        this.isPolling = false;
        return this.pollService.stopPoll();
    }

    @Post('/mail/start')
    startMailPoll(): string {
        console.log('Starting mail poll');
        this.isMailPolling = true;
        return this.pollService.startMailPoll();
    }

    @Post('/mail/stop')
    stopMailPoll(): string {
        console.log('Stopping mail poll');
        this.isMailPolling = false;
        return this.pollService.stopMailPoll();
    }
}
