import { ReactNode } from 'react';

interface CommonProps {
  id?: string;
  label: ReactNode;
  name: string;
  type?: 'text' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

interface TextAreaProps extends CommonProps {
  type: 'textarea';
  rows: number;
}

interface TextInputProps extends CommonProps {
  type: 'text';
  rows?: undefined;
}

type Props = TextAreaProps | TextInputProps;

function TextField({
  id = undefined,
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
  rows,
}: Props) {
  const inputClasses = `w-full px-3 py-2 mb-1 border border-input rounded-lg placeholder-mutedForeground focus:ring-primary focus:border-primary transition duration-150 ${
    touched && error ? 'border-red-500' : 'border-input'
  }`;

  const errorClasses = 'text-red-500 text-sm';

  return (
    <div className="mb-4" id={id}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground mb-1"
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClasses} resize-y`}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
        />
      )}
      {touched && error ? <div className={errorClasses}>{error}</div> : null}
    </div>
  );
}

export default TextField;
