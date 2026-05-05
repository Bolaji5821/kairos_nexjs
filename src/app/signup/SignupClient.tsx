"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle2, Send, ShieldCheck, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateOTP, registerUser, UserRole } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

type Intent = "talent" | "company";

export function SignupClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [intent, setIntent] = useState<Intent>("talent");

  const handleIntentChange = (newIntent: Intent) => {
    setIntent(newIntent);
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    otp: "",
    dob: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleGoogleSignup = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err: any) {
      setError("Google signup failed");
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }
    setSendingOtp(true);
    setError(null);
    try {
      const result = await generateOTP(formData.email);
      if (result.message) {
        setOtpSent(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const role: UserRole = intent === "company" ? "COMPANY" : "STUDENT";
      
      const result = await registerUser({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        role,
        otp: formData.otp,
        companyName: intent === "company" ? formData.companyName : undefined,
        dob: intent === "talent" ? formData.dob : undefined,
      });

      if (result.data?.token) {
        const userData = {
          email: formData.email,
          role,
          firstName: formData.firstName,
          lastName: formData.lastName,
        };
        login(result.data.token, userData);
        router.push("/dashboard");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
      <div className="w-full max-w-lg">
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
          
          <h1 className="text-3xl font-bold dark:text-white mb-3">Create your account</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Join Kairos and start your journey
          </p>
        </div>

        {/* Intent Selector */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl mb-8 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => handleIntentChange("talent")}
            className={cn(
              "py-3 px-4 rounded-xl text-sm font-semibold transition-all",
              intent === "talent"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            I&apos;m looking for work
          </button>
          <button
            type="button"
            onClick={() => handleIntentChange("company")}
            className={cn(
              "py-3 px-4 rounded-xl text-sm font-semibold transition-all",
              intent === "company"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            I&apos;m hiring
          </button>
        </div>

        {/* Signup Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Last name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            {/* Company Name (only for company) */}
            {intent === "company" && (
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Company name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="w-5 h-5 text-zinc-400" />
                  </div>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
                    placeholder="Your Company Inc."
                  />
                </div>
              </div>
            )}

            {/* Date of Birth (only for talent) */}
            {intent === "talent" && (
              <div className="space-y-2">
                <label htmlFor="dob" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Date of birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                  </div>
                  <input
                    id="dob"
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field with Send OTP */}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-28 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
                  placeholder="you@example.com"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !formData.email}
                  className="absolute inset-y-0 right-2 my-2 px-4 bg-[#C2185B] text-white rounded-xl text-sm font-semibold hover:bg-[#A3154D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingOtp ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : otpSent ? (
                    "Resend OTP"
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send OTP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* OTP Field (only show after OTP is sent) */}
            {otpSent && (
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Verification code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/[^0-9]/g, "") })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all text-center tracking-widest text-xl"
                    placeholder="123456"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className="space-y-2 mt-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Password must contain:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-md flex items-center gap-1",
                    formData.password.length >= 8
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  )}>
                    <CheckCircle2 className="w-3 h-3" />
                    8+ characters
                  </span>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={cn(
                  "mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all",
                  termsAccepted
                    ? "bg-[#C2185B] border-[#C2185B]"
                    : "border-zinc-300 dark:border-zinc-600 hover:border-[#C2185B]"
                )}
              >
                {termsAccepted && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms-of-service" className="text-[#C2185B] font-medium hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-[#C2185B] font-medium hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !termsAccepted || !otpSent}
              className="w-full bg-[#C2185B] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A3154D] transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="animate-pulse">Creating account...</span>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
            <span className="px-4 text-sm text-zinc-400">or continue with</span>
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {!otpSent && (
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            )}
            
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.756-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center mt-8 text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
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
