import { IsValidCpfCnpjConstraint } from './cpf-cnpj.validator';

describe('IsValidCpfCnpjConstraint', () => {
  const validator = new IsValidCpfCnpjConstraint();

  it('should validate a valid CPF', () => {
    expect(validator.validate('36836655724')).toBe(true);
  });

  it('should validate a valid CPF with formatting', () => {
    expect(validator.validate('368.366.557-24')).toBe(true);
  });

  it('should validate a valid CNPJ', () => {
    expect(validator.validate('11222333000181')).toBe(true);
  });

  it('should validate a valid CNPJ with formatting', () => {
    expect(validator.validate('11.222.333/0001-81')).toBe(true);
  });

  it('should reject an invalid CPF', () => {
    expect(validator.validate('12345678901')).toBe(false);
  });

  it('should reject an invalid CNPJ', () => {
    expect(validator.validate('11111111111111')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(validator.validate('')).toBe(false);
  });

  it('should reject null', () => {
    expect(validator.validate(null as any)).toBe(false);
  });

  it('should return correct default message', () => {
    expect(validator.defaultMessage()).toBe('CPF ou CNPJ inválido');
  });
});
