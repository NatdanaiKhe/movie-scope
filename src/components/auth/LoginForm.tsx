"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser, Profile } from "@/types";

const loginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .required();

type LoginFormValues = yup.InferType<typeof loginSchema>;

async function loadProfile(user: AuthUser): Promise<Profile | null> {
  try {
    const { profile } = await profileService.getByUserId(user.id);
    return profile;
  } catch {
    try {
      const { profile } = await profileService.create({
        userId: user.id,
        displayName: user.name,
      });
      return profile;
    } catch (error) {
      console.error("Profile load failed after login:", error);
      return null;
    }
  }
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "1";
  const setUser = useAuthStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setSubmitError("");
      const data = await authService.login(values);
      const profile = await loadProfile(data.user);
      setUser(data.user, profile);
      router.push("/");
    } catch {
      setSubmitError("Unable to log in. Check your credentials and try again.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-950/70 p-6 shadow-lg md:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-yellow-500">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Log in</h1>
        <p className="mt-2 text-sm text-gray-400">
          Continue exploring movies, trailers, and top rated picks.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {isRegistered && (
          <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            Registration successful. Please log in.
          </p>
        )}

        {submitError && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {submitError}
          </p>
        )}

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
              autoComplete="current-password"
              placeholder="Enter your password"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        New to MovieScope?{" "}
        <Link href="/register" className="font-semibold text-yellow-500">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
