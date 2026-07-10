import { loginUser, registerUser, requestRecoveryCode, resetPassword, verifyRecoveryCode } from '../../services/authService';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

const mockPost = api.post as jest.Mock;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('calls POST /auth/login with username and password', async () => {
      mockPost.mockResolvedValue({ token: 'test_token' });

      const result = await loginUser('username', 'password123');

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        username: 'username',
        password: 'password123',
      });
      expect(result).toEqual({ token: 'test_token' });
    });
  });

  describe('registerUser', () => {
    it('calls POST /auth/register/buyer with user data', async () => {
      const userData = {
        username: 'juanperez',
        first_name: 'Juan',
        last_name: 'Perez',
        email: 'juan@example.com',
        dni_number: '12345678',
        password: 'password123',
      };
      mockPost.mockResolvedValue({ success: true });

      const result = await registerUser(userData);

      expect(mockPost).toHaveBeenCalledWith('/auth/register/buyer', userData);
      expect(result).toEqual({ success: true });
    });
  });

  describe('requestRecoveryCode', () => {
    it('calls POST /auth/recovery/request-code with username', async () => {
      mockPost.mockResolvedValue({ email: 'juan@example.com' });

      const result = await requestRecoveryCode('juanperez');

      expect(mockPost).toHaveBeenCalledWith('/auth/recovery/request-code', {
        username: 'juanperez',
      });
      expect(result).toEqual({ email: 'juan@example.com' });
    });
  });

  describe('resetPassword', () => {
    it('calls POST /auth/recovery/reset-password with credentials', async () => {
      mockPost.mockResolvedValue({ success: true });

      const result = await resetPassword('juanperez', '123456', 'newpassword123');

      expect(mockPost).toHaveBeenCalledWith('/auth/recovery/reset-password', {
        username: 'juanperez',
        code: '123456',
        new_password: 'newpassword123',
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('verifyRecoveryCode', () => {
    it('calls POST /auth/recovery/verify-code with username and code', async () => {
      mockPost.mockResolvedValue({ valid: true });

      const result = await verifyRecoveryCode('juanperez', '123456');

      expect(mockPost).toHaveBeenCalledWith('/auth/recovery/verify-code', {
        username: 'juanperez',
        code: '123456',
      });
      expect(result).toEqual({ valid: true });
    });
  });
});
