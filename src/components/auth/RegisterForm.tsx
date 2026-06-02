"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { authService } from "@/services/auth.service";

const registerSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: yup
      .string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password needs one uppercase letter")
      .matches(/[0-9]/, "Password needs one number"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  })
  .required();

type RegisterFormValues = yup.InferType<typeof registerSchema>;

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setSubmitError("");
      const { confirmPassword, ...payload } = values;
      void confirmPassword;
      await authService.register(payload);
      router.push("/login?registered=1");
    } catch {
      setSubmitError("Unable to create account. Try again later.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-950/70 p-6 shadow-lg md:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-yellow-500">
          Join MovieScope
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-sm text-gray-400">
          Save favorites and keep your movie discovery in one place.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {submitError && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {submitError}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-gray-300">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-3 text-gray-500 transition hover:text-yellow-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm text-gray-300"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-yellow-500">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
