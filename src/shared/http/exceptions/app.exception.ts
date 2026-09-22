import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCode } from './error-code.enum';

export class AppException extends HttpException {
  constructor(
    public readonly code: ErrorCode,
    status: HttpStatus,
    public readonly details?: unknown
  ) {
    super(
      {
        code,
        details,
      },
      status
    );
  }
}
