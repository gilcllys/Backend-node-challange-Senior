import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';

@ValidatorConstraint({ async: false })
export class IsValidCpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) return false;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 11) return cpf.isValid(cleaned);
    if (cleaned.length === 14) return cnpj.isValid(cleaned);
    return false;
  }

  defaultMessage(): string {
    return 'CPF ou CNPJ inválido';
  }
}

export function IsValidCpfCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCpfCnpjConstraint,
    });
  };
}
