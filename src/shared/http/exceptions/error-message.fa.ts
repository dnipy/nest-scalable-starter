import { ErrorCode } from './error-code.enum';

export const ErrorMessagesEn: Record<ErrorCode, string> = {
  [ErrorCode.INTERNAL_ERROR]: 'there was an internal error',
  [ErrorCode.VALIDATION_ERROR]: 'اطلاعات وارد شده صحیح نیست',
  [ErrorCode.BAD_REQUEST]: 'درخواست نامعتبر است.',
  [ErrorCode.UNAUTHORIZED]: 'دسترسی نیاز به احراز هویت دارد.',
  [ErrorCode.CONFLICT]: 'اطلاعات ارسالی با داده‌های موجود تداخل دارد.',
  [ErrorCode.TOO_MANY_REQUESTS]:
    'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً دوباره تلاش کنید.',
  [ErrorCode.SERVICE_UNAVAILABLE]:
    'سرویس موقتاً در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.',

  [ErrorCode.INVALID_REQUEST]: 'Invalid request',
  [ErrorCode.ACCESS_DENIED]: 'not allowed',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'not found',
};
