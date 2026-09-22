import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { mapPrismaError } from './prisma-error.mapper';
import { ErrorTrackingService } from 'src/shared/observability/error-tracking/error-tracking.service';
import { ErrorCode } from '../exceptions/error-code.enum';
import { ErrorMessagesEn } from '../exceptions/error-message.fa';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorTracking: ErrorTrackingService) {}

  async catch(_exception: unknown, host: ArgumentsHost) {
    const originalException = _exception;
    let exception = _exception;

    const prismaException = mapPrismaError(exception);

    if (prismaException) {
      exception = prismaException;
    }

    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const shouldReport =
      !(exception instanceof HttpException) ||
      (status >= HttpStatus.INTERNAL_SERVER_ERROR &&
        status !== HttpStatus.SERVICE_UNAVAILABLE);

    if (shouldReport) {
      await this.errorTracking.capture({
        message:
          originalException instanceof Error
            ? originalException.message
            : String(originalException),

        stack:
          originalException instanceof Error
            ? originalException.stack
            : undefined,

        path: request.originalUrl,
        method: request.method,
      });
    }
    // Custom application exceptions
    if (exception instanceof AppException) {
      return response.status(status).json({
        success: false,
        code: exception.code,
        message: ErrorMessagesEn[exception.code],
        ...(exception.details && {
          details: exception.details,
        }),
      });
    }

    // NestJS built-in exceptions
    if (exception instanceof HttpException) {
      const code = this.mapHttpException(exception);

      return response.status(status).json({
        success: false,
        code,
        message: ErrorMessagesEn[code],
      });
    }

    // Unknown exceptions
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: ErrorCode.INTERNAL_ERROR,
      message: ErrorMessagesEn[ErrorCode.INTERNAL_ERROR],
    });
  }

  private mapHttpException(exception: HttpException): ErrorCode {
    switch (exception.getStatus()) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;

      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;

      case HttpStatus.FORBIDDEN:
        return ErrorCode.ACCESS_DENIED;

      case HttpStatus.NOT_FOUND:
        return ErrorCode.RESOURCE_NOT_FOUND;

      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;

      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCode.TOO_MANY_REQUESTS;

      case HttpStatus.SERVICE_UNAVAILABLE:
        return ErrorCode.SERVICE_UNAVAILABLE;

      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }
}
