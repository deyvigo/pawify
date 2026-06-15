import { useState } from 'react';
import EyeIcon from './EyeIcon';

export default function PasswordInput({ id, name, value, onChange, placeholder = '••••••••', label }) {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="password-wrapper">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShow((p) => !p)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}
