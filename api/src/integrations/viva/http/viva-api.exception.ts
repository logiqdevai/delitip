import { HttpException } from '@nestjs/common';
import { VivaErrorResponse } from '../interfaces/viva-common.interface';

export class VivaApiException extends HttpException {
  constructor(
    statusCode: number,
    message: string,
    public readonly vivaResponse?: VivaErrorResponse,
  ) {
    super({ message, viva: vivaResponse }, statusCode);
  }
}
