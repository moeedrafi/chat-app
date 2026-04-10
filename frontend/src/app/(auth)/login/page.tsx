import { LoginForm } from "@/components/forms/LoginForm";

const LoginPage = () => {
  return (
    <section
      aria-labelledby="login-heading"
      className="h-screen px-2 flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-[3rem] leading-[1.2em] font-bold text-center">
          Login
        </h1>

        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
