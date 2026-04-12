"use client";
import Link from "next/link";
import { useAppForm } from "@/hooks/form";
import { useRouter } from "next/navigation";
import { registerFormOptions } from "@/lib/shared-form";

export const RegisterForm = () => {
  const router = useRouter();
  const form = useAppForm(registerFormOptions(router));

  return (
    <>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField name="username">
          {(field) => (
            <field.TextField required label="Username" placeholder="John Doe" />
          )}
        </form.AppField>

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

        <form.AppForm>
          <form.SubscribeButton
            type="submit"
            label="Register"
            className="w-full"
          />
        </form.AppForm>
      </form>

      <Link
        href="/login"
        className="w-full flex items-center justify-center text-sm text-secondary underline underline-offset-2"
      >
        Already have an account?
      </Link>
    </>
  );
};
