"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/lib/api";

export function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <img 
                src="/logo.png" 
                alt="Kairos Logo" 
                className="w-12 h-12 object-contain" 
              />
              <span className="text-2xl font-bold dark:text-white">Kairos<span className="text-[#C2185B]">.</span></span>
            </Link>
            
            <div className="w-20 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#C2185B]" />
            </div>
            
            <h1 className="text-3xl font-bold dark:text-white mb-3">Check your email</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              We&apos;ve sent a password reset link to {email}
            </p>
          </div>

          <Link 
            href="/login" 
            className="w-full bg-[#C2185B] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A3154D] transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <img 
              src="/logo.png" 
              alt="Kairos Logo" 
              className="w-12 h-12 object-contain" 
            />
            <span className="text-2xl font-bold dark:text-white">Kairos<span className="text-[#C2185B]">.</span></span>
          </Link>
          
          <h1 className="text-3xl font-bold dark:text-white mb-3">Reset your password</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-zinc-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C2185B] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A3154D] transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <p className="text-center mt-8 text-zinc-500 dark:text-zinc-400">
          Remember your password?{" "}
          <Link 
            href="/login" 
            className="font-semibold text-[#C2185B] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}