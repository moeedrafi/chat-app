import { TextArea } from "@/components/ui/TextArea";
import { createFormHook } from "@tanstack/react-form";
import { TextField } from "@/components/ui/TextField";
import { fieldContext, formContext } from "./form-context";
import { SubscribeButton } from "@/components/ui/SubscribeButton";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextArea,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
