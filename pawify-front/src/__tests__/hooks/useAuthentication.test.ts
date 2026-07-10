import { renderHook, act } from '@testing-library/react-native';
import { useAuthentication } from '../../hooks/useAuthentication';
import * as authService from '../../services/authService';
import { Alert } from 'react-native';

jest.mock('../../services/authService');

const mockLoginUser = authService.loginUser as jest.Mock;
const mockAlert = Alert.alert as jest.Mock;

describe('useAuthentication hook', () => {
  let onLoginSuccess: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    onLoginSuccess = jest.fn();
  });

  it('shows alert when username is empty', async () => {
    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    await act(async () => {
      await login('', 'password123');
    });

    expect(mockAlert).toHaveBeenCalledWith('Atención', 'Por favor, ingresa tu nombre de usuario y contraseña.');
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('shows alert when username has less than 6 characters', async () => {
    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    await act(async () => {
      await login('user', 'password123');
    });

    expect(mockAlert).toHaveBeenCalledWith('Atención', 'El Nombre de Usuario debe tener al menos 6 caracteres');
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('shows alert when password has less than 8 characters', async () => {
    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    await act(async () => {
      await login('username', 'pass');
    });

    expect(mockAlert).toHaveBeenCalledWith('Atención', 'La Contraseña debe tener al menos 8 caracteres');
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('calls loginUser on valid input', async () => {
    mockLoginUser.mockResolvedValue({ token: 'test_token' });

    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    await act(async () => {
      await login('username', 'password123');
    });

    expect(mockLoginUser).toHaveBeenCalledWith('username', 'password123');
  });

  it('sets isLoading true during request', async () => {
    let resolvePromise: (value: unknown) => void;
    mockLoginUser.mockImplementation(() => new Promise(resolve => {
      resolvePromise = resolve;
    }));

    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    let isLoadingDuringRequest: boolean | undefined;
    act(() => {
      login('username', 'password123');
    });
    isLoadingDuringRequest = result.current.isLoading;

    expect(isLoadingDuringRequest).toBe(true);

    await act(async () => {
      resolvePromise!({ token: 'test_token' });
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('calls onLoginSuccess on successful login', async () => {
    mockLoginUser.mockResolvedValue({ token: 'test_token' });

    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    await act(async () => {
      await login('username', 'password123');
    });

    expect(onLoginSuccess).toHaveBeenCalledWith({
      token: 'test_token',
      username: 'username',
    });
  });

  it('shows error alert on login failure', async () => {
    mockLoginUser.mockRejectedValue(new Error('Login failed'));

    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    await act(async () => {
      await login('username', 'password123');
    });

    expect(mockAlert).toHaveBeenCalledWith('Error', 'Nombre de usuario o contraseña incorrectos.');
  });

  it('sets isLoading false after completion (success or failure)', async () => {
    mockLoginUser.mockRejectedValue(new Error('Login failed'));

    const { result } = renderHook(() => useAuthentication(onLoginSuccess));
    const { login } = result.current;

    await act(async () => {
      await login('username', 'password123');
    });

    expect(result.current.isLoading).toBe(false);
  });
});
