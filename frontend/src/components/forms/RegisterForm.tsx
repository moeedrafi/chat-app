"use client";
import Link from "next/link";
import { useAppForm } from "@/hooks/form";
import { registerFormOptions } from "@/lib/shared-form";

export const RegisterForm = () => {
  const form = useAppForm({ ...registerFormOptions });

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
        <form.AppField name="name">
          {(field) => (
            <field.TextField required label="Name" placeholder="John Doe" />
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

        <div className="space-y-3">
          <form.AppForm>
            <form.SubscribeButton
              type="submit"
              label="Register as Student"
              className="w-full"
              onClick={() => form.setFieldValue("isAdmin", false)}
            />
          </form.AppForm>

          <form.AppForm>
            <form.SubscribeButton
              type="submit"
              label="Register as Teacher"
              className="w-full"
              variant="ghost"
              onClick={() => form.setFieldValue("isAdmin", true)}
            />
          </form.AppForm>
        </div>
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
