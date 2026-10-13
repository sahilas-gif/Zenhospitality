import { describe, expect, it } from 'vitest';
import { CONTACT } from '../data/contact';
import { buildMessage, whatsappUrl } from './whatsapp';

describe('whatsapp', () => {
  it('uses only the Zen number', () => {
    expect(whatsappUrl('Hi')).toContain('918828015060');
    expect(CONTACT.phones).toEqual(['+91 88280 15060']);
    expect(CONTACT.emails).toEqual(['connect.zenworld@gmail.com']);
  });

  it('builds a message with a reference', () => {
    const text = buildMessage('Quote', [['Hotel', 'Nestor']], 'ZEN-000012');
    expect(text).toContain('Hotel: Nestor');
    expect(text).toContain('Reference: ZEN-000012');
  });
});
