import { describe, expect, it } from 'vitest';
import { validateEmail, validatePassword, validatePhone, validatePrice } from './validation';
import { slugify, uniqueSlug } from './slug';

describe('validaciones', () => {
  it('valida correos', () => {
    expect(validateEmail('ana@correo.com')).toBeNull();
    expect(validateEmail('ana@correo')).not.toBeNull();
  });

  it('valida contraseñas con letras y números', () => {
    expect(validatePassword('cancha2026')).toBeNull();
    expect(validatePassword('corta1')).not.toBeNull();
    expect(validatePassword('sinnumeros')).not.toBeNull();
  });

  it('valida teléfonos de Costa Rica', () => {
    expect(validatePhone('8888-1111')).toBeNull();
    expect(validatePhone('1234')).not.toBeNull();
  });

  it('valida precios enteros positivos', () => {
    expect(validatePrice(18000)).toBeNull();
    expect(validatePrice(0)).not.toBeNull();
  });
});

describe('slugs', () => {
  it('quita tildes y espacios', () => {
    expect(slugify('La Bombonera Sintética')).toBe('la-bombonera-sintetica');
  });

  it('agrega un número si el slug ya existe', () => {
    expect(uniqueSlug('Gol Center', new Set(['gol-center']))).toBe('gol-center-2');
  });
});
