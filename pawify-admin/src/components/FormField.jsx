export default function FormField({ id, label, type = 'text', value, onChange, placeholder, maxLength, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} name={id} type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} {...props} />
    </div>
  );
}
