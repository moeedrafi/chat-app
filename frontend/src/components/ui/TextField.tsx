import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const TextField = ({ label, required, ...props }: TextFieldProps) => {
  const field = useFieldContext<string>();
  const isSubmitting = useStore(field.form.store, (s) => s.isSubmitting);

  return (
    <div className="w-full flex flex-col gap-1">
      <label
        htmlFor={field.name}
        className={`font-semibold text-sm text-muted-foreground ${
          required ? "after:content-['*'] after:ml-1 after:text-red-500" : ""
        }`}
      >
        {label}
      </label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        aria-invalid={!field.state.meta.isValid}
        disabled={isSubmitting}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
        className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      {field.state.meta.isTouched && !field.state.meta.isValid && (
        <em role="alert" className="text-sm text-red-500">
          {field.state.meta.errors.map((err) => err?.message).join(", ")}
        </em>
      )}
    </div>
  );
};
