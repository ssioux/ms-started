import { BadRequestException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateDtoFromData<T extends object>(dtoToValidate: ClassConstructor<T>, data: any): T {
  const validatedData = plainToInstance(dtoToValidate, data);

  const errors = validateSync(validatedData, { whitelist: true });

  if (errors.length > 0) {
    throw new BadRequestException(
      errors.map((e) => Object.values(e.constraints).join(', ')).join('; '),
    );
  }

  return validatedData;
}
