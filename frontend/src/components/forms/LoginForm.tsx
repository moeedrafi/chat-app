"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppForm } from "@/hooks/form";
import { loginFormOptions } from "@/lib/shared-form";

export const LoginForm = () => {
  const router = useRouter();
  const form = useAppForm(loginFormOptions(router));

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
            label="Login"
            className="w-full"
          />
        </form.AppForm>
      </form>

      <Link
        href="/register"
        className="w-full flex items-center justify-center text-sm text-secondary underline underline-offset-2"
      >
        Don&apos;t have an account?
      </Link>
    </>
  );
};
