"use client";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/error";
import { toast } from "react-hot-toast";
import { useAppForm } from "@/hooks/form";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/lib/schemas";

const initialState: ForgotPasswordFormData = {
  email: "",
};

export const ForgotPasswordForm = () => {
  const form = useAppForm({
    defaultValues: initialState,
    validators: { onBlur: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      const validatedData = forgotPasswordSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<void, ForgotPasswordFormData>(
          "/auth/forgot-password",
          validatedData.data,
        );

        toast.success(res.message);
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            required
            type="email"
            label="Email"
            placeholder="john.doe@gmail.com"
          />
        )}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton
          type="submit"
          label="Send Mail"
          className="w-full"
        />
      </form.AppForm>
    </form>
  );
};
