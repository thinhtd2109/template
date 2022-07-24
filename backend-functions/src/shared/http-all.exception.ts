import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { HTTP_STATUS } from './constants';

export const CatchExceptionFilter = (exception: any, res: Response) => {
  if (exception) {
    if (
      parseInt(exception.code) == HTTP_STATUS.INTERNAL_SERVER_ERROR ||
      exception.message.includes('{"errors":[{"extensions"')
    ) {
      console.error(exception.message);
      throw new BadRequestException({
        message: 'Internal Server Error',
        code: '500',
        exception_detail: JSON.stringify(exception),
      });
    }
    throw new BadRequestException(exception);
  }
  if (typeof exception === 'string') {
    throw new BadRequestException(exception);
  }
  console.error(exception);
  res.status(HTTP_STATUS.BAD_REQUEST).json({
    message: 'Internal Server Error',
    code: '500',
    exception_detail: JSON.stringify(exception),
  });
};
