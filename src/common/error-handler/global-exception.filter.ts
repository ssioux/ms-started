import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ExceptionType,
  ERRORS,
} from './exception.enum';

type ErrorMessage = {
  statusCode: number;
  errorMessage: string;
  errorCode: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const path = request.url;
    const method = request.method;

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string | undefined;
    let errorMessage: string = ERRORS.ERROR_DEFAULT_MESSAGE;

    this.logger.debug('[ EXCEPTION ] instanceof @ ' + (exception as any)?.constructor?.name);

    if (exception instanceof HttpException) {
      const errorDetails = exception.getResponse();
      // const httpErrorException = exception as any;
      this.logError(ExceptionType.CONTROLLED_ERROR, exception, method, path);

      status = exception.getStatus(); // what comes from this microservice.
      errorMessage = this.getErrorMessage(errorDetails);
      errorCode = this.getErrorCodeByMessage(errorMessage);

    } else {
      this.logError(ExceptionType.UNCONTROLLED_ERROR, exception, method, path);
    }

    // Check if the status gotten is different from a normal status, to not break the app.
    if (!Number.isInteger(status) || status < 100 || status > 599) {
      this.logger.warn(`[ WARNING ] Invalid status code detected: ${status}. Setting to 500.`);
      this.logger.warn(`[ WARNING ] errorDetails: ${JSON.stringify(exception)}`);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const errorResponse: ErrorMessage = {
      statusCode: status,
      errorCode: errorCode ?? ERRORS.ERROR_DEFAULT_CODE,
      errorMessage: errorMessage ?? ERRORS.ERROR_DEFAULT_MESSAGE,
    };
    response.status(status).json(errorResponse);
  }

  private getErrorMessage(errorDetails: string | object): string {
    this.logger.debug(`[ ERROR DETAILS ] typeof @ ${typeof errorDetails}`);
    switch (typeof errorDetails) {
      case 'string':
        return errorDetails;
      case 'object':
        const errorObject = errorDetails as Record<string, any>;
        return errorObject.message;
      default:
        return ERRORS.ERROR_DEFAULT_MESSAGE;
    }
  }

  private getErrorCodeByMessage(errorMessage: string): string | undefined {
    const keys = Object.keys(ERRORS).find((keys) => ERRORS[keys as keyof typeof ERRORS] == errorMessage);
    return keys || ERRORS.ERROR_DEFAULT_CODE;
  }

  private logError(type: string, exception: any, method: string, path: string) {
    switch (type) {
      case ExceptionType.CONTROLLED_ERROR:
        // ! .getResponse() always inside HttpException, where the function exist.
        const errorDetails = exception?.getResponse();
        if (typeof errorDetails === 'string') {
          return this.logger.error(`[ ${type} ]`, { message: errorDetails, method, path });
        } else {
          return this.logger.error(`[ ${type} ]`, { ...errorDetails, method, path });
        }

      case ExceptionType.UNCONTROLLED_ERROR:
        return this.logger.error(`[ ${type} ]`, {
          exceptionInstance: exception.constructor.name, // if ever we find another instanceof exception.
          code: exception.code,
          sqlErrorNo: exception.errno,
          message: exception.message,
          method: method,
          path: path,
        });
      default:
        break;
    }
  }
}
