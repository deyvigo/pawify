import { useAuth } from '../context/AuthContext';
import { useChangeAdminPassword } from '../hooks/useAdmins';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './PerfilPage.css';

export default function PerfilPage() {
  const { user } = useAuth();
  const pass = useChangeAdminPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await pass.submit(user?.username);
  };

  return (
    <div className="perfil-page">
      <h1>Perfil</h1>
      <div className="perfil-card">
        <h2>Datos del administrador</h2>
        <div className="perfil-info">
          <div><span>Username:</span> {user?.username}</div>
          <div><span>Nombre:</span> {user?.first_name} {user?.last_name}</div>
          <div><span>Rol:</span> {user?.role}</div>
        </div>
      </div>
      <div className="perfil-card">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <Alert type="success">{pass.message}</Alert>
          <Alert type="error">{pass.error}</Alert>
          <PasswordInput id="np" label="Nueva contraseña" value={pass.newPassword} onChange={(e) => pass.setNewPassword(e.target.value)} />
          <PasswordInput id="cp" label="Confirmar contraseña" value={pass.confirmPassword} onChange={(e) => pass.setConfirmPassword(e.target.value)} />
          <Button type="submit" loading={pass.saving ? 'Actualizando...' : false}>Actualizar contraseña</Button>
        </form>
      </div>
    </div>
  );
}
