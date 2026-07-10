import { decodeToken, getFullName } from '../../utils/jwt';
import { UserPayload } from '../../types';

const createTestToken = (payload: object): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerEncoded = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadEncoded = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signature = 'test_signature';
  return `${headerEncoded}.${payloadEncoded}.${signature}`;
};

describe('jwt utils', () => {
  describe('decodeToken', () => {
    it('decodes a valid token and returns UserPayload', () => {
      const payload: Partial<UserPayload> = {
        id: 1,
        username: 'juanperez',
        role: 'buyer',
        first_name: 'Juan',
        last_name: 'Perez',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const token = createTestToken(payload);
      const result = decodeToken(token);

      expect(result).not.toBeNull();
      expect(result?.username).toBe('juanperez');
      expect(result?.first_name).toBe('Juan');
      expect(result?.last_name).toBe('Perez');
      expect(result?.role).toBe('buyer');
    });

    it('returns null for invalid/malformed token', () => {
      const result = decodeToken('invalid.token.here');
      expect(result).toBeNull();
    });

    it('returns null for empty string', () => {
      const result = decodeToken('');
      expect(result).toBeNull();
    });

    it('returns null for token with invalid base64', () => {
      const result = decodeToken('!!!invalid.base64');
      expect(result).toBeNull();
    });
  });

  describe('getFullName', () => {
    it('returns full name combining first_name and last_name', () => {
      const user: UserPayload = {
        id: 1,
        username: 'juanperez',
        role: 'buyer',
        first_name: 'Juan',
        last_name: 'Perez',
        exp: 0,
      };
      const result = getFullName(user);
      expect(result).toBe('Juan Perez');
    });

    it('handles missing names gracefully', () => {
      const user: UserPayload = {
        id: 1,
        username: 'juanperez',
        role: 'buyer',
        first_name: '',
        last_name: '',
        exp: 0,
      };
      const result = getFullName(user);
      expect(result).toBe('');
    });

    it('trims outer whitespace from names', () => {
      const user: UserPayload = {
        id: 1,
        username: 'juanperez',
        role: 'buyer',
        first_name: '  Juan ',
        last_name: ' Perez  ',
        exp: 0,
      };
      const result = getFullName(user);
      expect(result).toBe('Juan   Perez');
    });
  });
});
