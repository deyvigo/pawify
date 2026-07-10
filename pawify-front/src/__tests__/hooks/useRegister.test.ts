import { renderHook, act } from '@testing-library/react-native';
import { useRegister } from '../../hooks/useRegister';
import * as authService from '../../services/authService';
import { Alert } from 'react-native';

jest.mock('../../services/authService');

const mockRegisterUser = authService.registerUser as jest.Mock;
const mockAlert = Alert.alert as jest.Mock;

describe('useRegister hook', () => {
  let onSuccess: jest.Mock;

  const validUserData = {
    username: 'juanperez',
    first_name: 'Juan',
    last_name: 'Perez',
    email: 'juan@example.com',
    dni_number: '12345678',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    onSuccess = jest.fn();
  });

  it('shows alert if terms are not accepted', async () => {
    const { result } = renderHook(() => useRegister());
    const { register } = result.current;

    await act(async () => {
      await register(validUserData, 'password123', false, onSuccess);
    });

    expect(mockAlert).toHaveBeenCalledWith('Atención', 'Debes aceptar los términos y condiciones.');
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('shows alert if passwords do not match', async () => {
    const { result } = renderHook(() => useRegister());
    const { register } = result.current;

    await act(async () => {
      await register(validUserData, 'differentpassword', true, onSuccess);
    });

    expect(mockAlert).toHaveBeenCalledWith('Atención', 'Las contraseñas no coinciden.');
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('shows alert if required fields are missing', async () => {
    const { result } = renderHook(() => useRegister());
    const { register } = result.current;

    const incompleteUserData = {
      username: 'juanperez',
      first_name: '',
      last_name: 'Perez',
      email: 'juan@example.com',
      dni_number: '12345678',
      password: 'password123',
    };

    await act(async () => {
      await register(incompleteUserData, 'password123', true, onSuccess);
    });

    expect(mockAlert).toHaveBeenCalledWith('Atención', 'Por favor, llena todos los campos obligatorios.');
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('calls registerUser on valid data', async () => {
    mockRegisterUser.mockResolvedValue({});

    const { result } = renderHook(() => useRegister());
    const { register } = result.current;

    await act(async () => {
      await register(validUserData, 'password123', true, onSuccess);
    });

    expect(mockRegisterUser).toHaveBeenCalledWith(validUserData);
  });

  it('sets isLoading true during request', async () => {
    let resolvePromise: (value: unknown) => void;
    mockRegisterUser.mockImplementation(() => new Promise(resolve => {
      resolvePromise = resolve;
    }));

    const { result } = renderHook(() => useRegister());
    const { register } = result.current;

    act(() => {
      register(validUserData, 'password123', true, onSuccess);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!({});
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('calls onSuccess on successful registration', async () => {
    mockRegisterUser.mockResolvedValue({});

    const { result } = renderHook(() => useRegister());
    const { register } = result.current;

    await act(async () => {
      await register(validUserData, 'password123', true, onSuccess);
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows error alert on registration failure', async () => {
    mockRegisterUser.mockRejectedValue(new Error('Registration failed'));

    const { result } = renderHook(() => useRegister());
    const { register } = result.current;

    await act(async () => {
      await register(validUserData, 'password123', true, onSuccess);
    });

    expect(mockAlert).toHaveBeenCalledWith('Error', 'No se pudo registrar la cuenta. Verifica que el DNI sea de 8 dígitos y el usuario sea único.');
  });
});
