import { useCreateAdmin, useAdminList } from '../hooks/useAdmins';
import FormField from '../components/FormField';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './AdminsPage.css';

export default function AdminsPage() {
  const { form, message, error, loading, handleChange, submit } = useCreateAdmin();
  const list = useAdminList();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submit();
    if (ok) list.refresh();
  };

  return (
    <div className="admins-page">
      <h1>Administradores</h1>

      <div className="admin-section">
        <h2>Crear nuevo administrador</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <Alert type="success">{message}</Alert>
          <Alert type="error">{error}</Alert>

          <div className="form-row">
            <FormField id="username" label="Username" value={form.username} onChange={handleChange} placeholder="admin123" />
            <FormField id="firstName" label="Nombres" value={form.firstName} onChange={handleChange} placeholder="Juan" />
          </div>

          <div className="form-row">
            <FormField id="lastName" label="Apellidos" value={form.lastName} onChange={handleChange} placeholder="Pérez" />
            <FormField id="dniNumber" label="DNI" value={form.dniNumber} onChange={handleChange} maxLength={8} placeholder="12345678" />
          </div>

          <div className="form-row">
            <PasswordInput id="password" label="Contraseña" value={form.password} onChange={handleChange} />
            <PasswordInput id="confirmPassword" label="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} />
          </div>

          <Button type="submit" loading={loading ? 'Creando...' : false}>Crear administrador</Button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Administradores actuales</h2>

        <Alert type="error">{list.error}</Alert>

        {list.admins.length > 0 ? (
          <>
            <div className="admin-table">
              <div className="table-header">
                <span>Username</span>
                <span>Nombres</span>
                <span>Apellidos</span>
                <span>DNI</span>
              </div>
              {list.admins.map((admin) => (
                <div key={admin.username} className="table-row">
                  <span>{admin.username}</span>
                  <span>{admin.first_name || '-'}</span>
                  <span>{admin.last_name || '-'}</span>
                  <span>{admin.dni_number || '-'}</span>
                </div>
              ))}
            </div>

            <div className="pagination">
              <Button variant="secondary" disabled={list.loading || list.first} onClick={() => list.setPage((p) => p - 1)}>Anterior</Button>
              <span>Página {list.page + 1}</span>
              <Button variant="secondary" disabled={list.loading || list.last} onClick={() => list.setPage((p) => p + 1)}>Siguiente</Button>
            </div>
          </>
        ) : list.loading ? (
          <p className="list-empty">Cargando...</p>
        ) : (
          <p className="list-empty">No se encontraron administradores</p>
        )}
      </div>
    </div>
  );
}
