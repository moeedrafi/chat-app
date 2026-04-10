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
        const res = await api.post<void, ResetPasswordFormData>(
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
      <form.Field name="password">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label
              htmlFor={field.name}
              className="text-text text-base leading-[1.6em]"
            >
              Password
            </label>
            <input
              type="password"
              id={field.name}
              name={field.name}
              value={field.state.value}
              placeholder="******"
              disabled={isSubmitting}
              aria-invalid={!field.state.meta.isValid}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:ring-0 disabled:focus-visible:ring-0"
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <em role="alert" className="text-red-500">
                {field.state.meta.errors.map((err) => err?.message).join(", ")}
              </em>
            )}
          </div>
        )}
      </form.Field>

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
