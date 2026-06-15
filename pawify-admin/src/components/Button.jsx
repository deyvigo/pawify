export default function Button({ variant = 'primary', loading, children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} disabled={loading} {...props}>
      {loading ? (typeof loading === 'string' ? loading : 'Cargando...') : children}
    </button>
  );
}
