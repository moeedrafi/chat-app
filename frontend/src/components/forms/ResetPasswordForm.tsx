"use client";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/error";
import { toast } from "react-hot-toast";
import { useAppForm } from "@/hooks/form";
import { useSearchParams } from "next/navigation";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/schemas";

const initialState: ResetPasswordFormData = {
  password: "",
  confirmPassword: "",
};

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useAppForm({
    defaultValues: initialState,
    validators: { onBlur: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      const validatedData = resetPasswordSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<ResetPasswordFormData>(
          `/auth/reset-password?token=${token}`,
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
      <form.AppField name="password">
        {(field) => (
          <field.TextField
            required
            type="password"
            label="Password"
            placeholder="******"
          />
        )}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {(field) => (
          <field.TextField
            required
            type="password"
            label="Confirm Password"
            placeholder="******"
          />
        )}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton
          type="submit"
          label="Register"
          className="w-full"
        />
      </form.AppForm>
    </form>
  );
};
