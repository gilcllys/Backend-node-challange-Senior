import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidAreaConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const obj = args.object as Record<string, number>;
    const totalArea = obj.totalArea;
    const arableArea = obj.arableArea;
    const vegetationArea = obj.vegetationArea;

    if (
      totalArea === undefined ||
      arableArea === undefined ||
      vegetationArea === undefined
    ) {
      return true; // let other validators handle required checks
    }

    return arableArea + vegetationArea <= totalArea;
  }

  defaultMessage(): string {
    return 'A soma da área agricultável e vegetação não pode ultrapassar a área total da fazenda';
  }
}

export function IsValidArea(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidAreaConstraint,
    });
  };
}
