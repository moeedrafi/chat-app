import { Button } from "@/components/ui/Button";
import { useFormContext } from "@/hooks/form-context";

type SubscribeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
};

export const SubscribeButton = ({
  variant = "primary",
  label,
  ...props
}: SubscribeButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button variant={variant} disabled={isSubmitting} {...props}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
};
