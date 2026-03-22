import { ValidationArguments } from 'class-validator';
import { IsValidAreaConstraint } from './area.validator';

describe('IsValidAreaConstraint', () => {
  const validator = new IsValidAreaConstraint();

  const makeArgs = (obj: Record<string, number>): ValidationArguments =>
    ({
      object: obj,
      property: 'totalArea',
      value: obj.totalArea,
      targetName: 'Test',
      constraints: [],
    }) as ValidationArguments;

  it('should pass when arable + vegetation <= total', () => {
    const args = makeArgs({
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 400,
    });
    expect(validator.validate(1000, args)).toBe(true);
  });

  it('should pass when arable + vegetation < total', () => {
    const args = makeArgs({
      totalArea: 1000,
      arableArea: 300,
      vegetationArea: 200,
    });
    expect(validator.validate(1000, args)).toBe(true);
  });

  it('should fail when arable + vegetation > total', () => {
    const args = makeArgs({
      totalArea: 1000,
      arableArea: 700,
      vegetationArea: 400,
    });
    expect(validator.validate(1000, args)).toBe(false);
  });

  it('should pass when values are undefined (let required validators handle)', () => {
    const args = makeArgs({} as any);
    expect(validator.validate(undefined, args)).toBe(true);
  });

  it('should return correct default message', () => {
    expect(validator.defaultMessage()).toContain('área total');
  });
});
