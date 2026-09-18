import { inputClass, labelClass, selectClass } from "@/lib/ui";

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
};

export function TextField({ label, name, required, placeholder, defaultValue }: BaseProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}

export function NumberField({
  label,
  name,
  required,
  defaultValue,
  step = "0.01",
  suffix,
}: BaseProps & { step?: string; suffix?: string }) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label} {suffix && <span className="text-neutral-400">({suffix})</span>}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        step={step}
        required={required}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}

export function DateField({ label, name, required, defaultValue }: BaseProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="date"
        required={required}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  required,
  defaultValue,
  options,
}: BaseProps & { options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={selectClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({ label, name, defaultValue }: BaseProps) {
  return (
    <div className="sm:col-span-2">
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
