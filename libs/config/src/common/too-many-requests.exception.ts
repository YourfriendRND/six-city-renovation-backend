import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
    constructor(nextRequestDate: Date) {
        super({
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Rate limit exceeded. Please try again after ${nextRequestDate.toISOString()}`,
            retryAfter: nextRequestDate.toISOString(),
        }, HttpStatus.TOO_MANY_REQUESTS)
    }
}
