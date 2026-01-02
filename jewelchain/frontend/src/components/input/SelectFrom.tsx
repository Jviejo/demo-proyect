import React from "react";

interface SelectFormProps {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

export const SelectForm = ({
  label,
  name,
  options,
  value,
  onChange,
  required,
}: SelectFormProps) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="" disabled>
          Selecciona una opción
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
