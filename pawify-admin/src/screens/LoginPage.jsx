import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useAuth';
import FormField from '../components/FormField';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error: loginError } = useLogin();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/products';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      const data = await login(username, password);
      setSession(data.token);
      navigate(from, { replace: true });
    } catch { /* error handled in hook */ }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Pawify Admin</h1>
        <p className="login-subtitle">Inicia sesión para administrar</p>
        <form onSubmit={handleSubmit}>
          <Alert type="error">{loginError}</Alert>
          <FormField id="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Admin" />
          <PasswordInput id="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" loading={isLoading ? 'Ingresando...' : false}>Iniciar sesión</Button>
        </form>
      </div>
    </div>
  );
}
