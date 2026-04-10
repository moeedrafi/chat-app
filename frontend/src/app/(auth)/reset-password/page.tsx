import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <section
      aria-labelledby="reset-password-heading"
      className="px-2 h-screen flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Reset Password
        </h1>

        <ResetPasswordForm />
      </div>
    </section>
  );
};

export default ResetPasswordPage;
