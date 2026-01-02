interface InputFormProps {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;    // Añadir esta línea
  max?: number;    // Añadir esta línea
}

export const InputForm = ({
  label,
  name,
  placeholder,
  type,
  required,
  value,
  onChange,
}: InputFormProps) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input input-bordered w-full max-w-xs"
      />
    </label>
  );
};
