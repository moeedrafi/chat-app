import { RegisterForm } from "@/components/forms/RegisterForm";

const RegisterPage = () => {
  return (
    <section
      aria-labelledby="register-heading"
      className="h-screen px-2 flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Register
        </h1>

        <RegisterForm />
      </div>
    </section>
  );
};

export default RegisterPage;
