import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

function LoginPage() {
  return (
    <main className="flex min-h-[calc(100svh-8rem)] w-full items-center justify-center bg-gray-900 px-4 py-10">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

export default LoginPage;
