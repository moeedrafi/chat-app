import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formOptions } from "@tanstack/react-form-nextjs";
import {
  LoginFormData,
  loginSchema,
  RegisterFormData,
  registerSchema,
} from "@/lib/schemas";
import { api } from "./api";
import { ApiError } from "./error";

/* REGISTER */
const registerInitialState: RegisterFormData = {
  email: "",
  name: "",
  password: "",
};

export const registerFormOptions = (router: ReturnType<typeof useRouter>) =>
  formOptions({
    defaultValues: registerInitialState,
    validators: { onBlur: registerSchema },
    onSubmit: async ({ value }) => {
      const validatedData = registerSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<RegisterFormData>(
          "/auth/signup",
          validatedData.data,
        );

        toast.success(res.message);
        router.push("/");
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

/* LOGIN */
const loginInitialState: LoginFormData = {
  email: "",
  password: "",
};

export const loginFormOptions = (router: ReturnType<typeof useRouter>) =>
  formOptions({
    defaultValues: loginInitialState,
    validators: { onBlur: loginSchema },
    onSubmit: async ({ value }) => {
      const validatedData = loginSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<LoginFormData>(
          "/auth/signin",
          validatedData.data,
        );

        toast.success(res.message);
        router.push("/");
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
