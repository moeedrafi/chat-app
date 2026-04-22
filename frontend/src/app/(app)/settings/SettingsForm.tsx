"use client";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/error";
import { useAppForm } from "@/hooks/form";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";

const initialState: SettingsFormData = {
  email: "",
  username: "",
  password: "",
  newPassword: "",
};

export const SettingsForm = () => {
  const form = useAppForm({
    defaultValues: initialState,
    validators: { onBlur: settingsSchema },
    onSubmit: async ({ value }) => {
      const validatedData = settingsSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        // TODO: add api
        const res = await api.post<SettingsFormData>(
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
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="bg-bg p-3 rounded-lg space-y-4 border border-color">
        <div className="flex flex-col sm:flex-row gap-3">
          <form.AppField name="username">
            {(field) => (
              <field.TextField label="Username" placeholder="johndoe" />
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <field.TextField
                type="email"
                label="Email"
                placeholder="john.doe@gmail.com"
              />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <form.AppField name="password">
            {(field) => (
              <field.TextField
                type="password"
                label="Password"
                placeholder="******"
              />
            )}
          </form.AppField>

          <form.AppField name="newPassword">
            {(field) => (
              <field.TextField
                type="password"
                label="New Password"
                placeholder="******"
              />
            )}
          </form.AppField>
        </div>
      </div>

      <form.AppForm>
        <form.SubscribeButton type="submit" label="Save" className="w-1/4" />
      </form.AppForm>
    </form>
  );
};
