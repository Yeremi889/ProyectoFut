import { describe, expect, it } from 'vitest';
import { buildGoogleMapsUrl, buildWazeUrl, buildWhatsAppUrl, toInternationalPhone } from './links';

describe('toInternationalPhone', () => {
  it('agrega el código de Costa Rica a números de 8 dígitos', () => {
    expect(toInternationalPhone('8888-1111')).toBe('50688881111');
  });

  it('respeta números que ya traen código de país', () => {
    expect(toInternationalPhone('+506 8888 1111')).toBe('50688881111');
  });
});

describe('links externos', () => {
  it('arma el link de WhatsApp con el mensaje codificado', () => {
    expect(buildWhatsAppUrl('88881111', 'Hola mundo')).toBe(
      'https://wa.me/50688881111?text=Hola%20mundo',
    );
  });

  it('usa coordenadas cuando existen', () => {
    const point = { lat: 9.93, lng: -84.08 };
    expect(buildWazeUrl(point, '')).toContain('ll=9.93,-84.08');
    expect(buildGoogleMapsUrl(point, '')).toContain('destination=9.93%2C-84.08');
  });

  it('usa la dirección cuando no hay coordenadas', () => {
    expect(buildWazeUrl(null, 'Desamparados')).toContain('q=Desamparados');
  });
});
