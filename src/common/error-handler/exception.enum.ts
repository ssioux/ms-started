
// TODO: Add more microservice specific errors. with the ms name.
const microserviceName = 'TOURNAMENTS';
/**
 * @CustomErrors
 */

export enum ExceptionType {
  CONTROLLED_ERROR = 'CONTROLLED_ERRO',
  UNCONTROLLED_ERROR = 'UNCONTROLLED_ERROR',
}

export enum ERRORS {
  // Microservice Specific Errors.
  ERROR_MICROSERVICE_NAME_XXX = 'error description todo',

  // General Errors.
  ERROR_DATA_VALIDATION = 'Input data validation error',
  ERROR_DATA_TENANT = 'No `tenant` header is provided',
  ERROR_DEFAULT_MESSAGE = 'Internal server error',
  ERROR_DEFAULT_CODE = `ERROR_${microserviceName}_00`,
}
