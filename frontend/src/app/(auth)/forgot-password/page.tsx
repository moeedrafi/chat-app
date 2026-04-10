import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <section
      aria-labelledby="forgot-password-heading"
      className="px-2 h-screen flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Forgot Password
        </h1>

        <ForgotPasswordForm />
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
