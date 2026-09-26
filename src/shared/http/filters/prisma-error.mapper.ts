import { HttpStatus } from '@nestjs/common';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode } from '../exceptions/error-code.enum';
import { Prisma } from 'src/shared/infrastructure/database/prisma/client/client';

export function mapPrismaError(error: unknown): AppException | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (error?.code) {
    /**
     * Unique constraint
     * e.g email already exists
     */
    case 'P2002':
      return new AppException(ErrorCode.CONFLICT, HttpStatus.CONFLICT, {
        fields: (error?.meta?.target as string[]) ?? [],
      });

    /**
     * Record not found
     */
    case 'P2025':
      return new AppException(
        ErrorCode.RESOURCE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        {
          cause: error.meta?.cause,
        },
      );

    /**
     * Foreign key constraint
     */
    case 'P2003':
      return new AppException(ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST, {
        field: error.meta?.field_name,
      });

    /**
     * Invalid query
     */
    case 'P2009':
    case 'P2012':
      return new AppException(ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST);

    case 'P2014':
      return new AppException(ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST);

    case 'P2034':
      return new AppException(ErrorCode.CONFLICT, HttpStatus.CONFLICT);

    // missing col or table : so 500
    case 'P2021':
    case 'P2022':
      return new AppException(
        ErrorCode.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    default:
      return new AppException(
        ErrorCode.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
}
