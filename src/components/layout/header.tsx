"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

interface HeaderProps {
  intent: "talent" | "company";
  setIntent: (intent: "talent" | "company") => void;
}

export function Header({ intent, setIntent }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleIntentSwitch = () => {
    const newIntent = intent === "talent" ? "company" : "talent";
    setIntent(newIntent);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
  ];

  const getSignupText = () => intent === "talent" ? "Join as Talent" : "Start Hiring";
  const getIntentLabel = () => {
    if (user) {
      return user.role === "COMPANY" || user.role === "ADMIN" || user.role === "SUPERADMIN" ? "For Talent" : "For Companies";
    }
    return intent === "talent" ? "For Companies" : "For Talent";
  };

  const userInitials = user 
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() 
    : "";

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  // Hide header when user is logged in and on dashboard
  if (user && isDashboard) {
    return null;
  }

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800" 
        : isDashboard
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {!isDashboard && (
            <Link href="/" className="flex items-center gap-1 cursor-pointer">
              <img src="/logo.png" alt="Kairos Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold dark:text-white">Kairos<span className="text-[#C2185B]">.</span></span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
            {!pathname.startsWith("/dashboard") && (
              <button
                onClick={handleIntentSwitch}
                className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                {getIntentLabel()}
              </button>
            )}
          </nav>

          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C2185B] flex items-center justify-center text-white font-bold">
                    {userInitials || "U"}
                  </div>
                </button>
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <a 
                  href="https://app.kairosng.com/auth/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </a>
                <a
                  href="https://app.kairosng.com/auth/onboarding/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C2185B] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#A3154D] transition-colors cursor-pointer"
                >
                  {getSignupText()}
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            {user && (
              <button
                onClick={() => router.push("/dashboard")}
                className="w-10 h-10 rounded-full bg-[#C2185B] flex items-center justify-center text-white font-bold"
              >
                {userInitials || "U"}
              </button>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-16 left-0 w-full bg-white dark:bg-black transition-all duration-300 ease-in-out overflow-hidden border-b border-zinc-100 dark:border-zinc-800",
        isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
            >
              {link.name}
            </Link>
          ))}
          {!pathname.startsWith("/dashboard") && (
            <button
              onClick={() => {
                handleIntentSwitch();
                setIsMenuOpen(false);
              }}
              className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
            >
              {getIntentLabel()}
            </button>
          )}
          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[#C2185B] text-white px-5 py-3 rounded-full text-sm font-medium text-center"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 dark:text-red-400 py-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <a 
                  href="https://app.kairosng.com/auth/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
                >
                  Sign In
                </a>
                <a 
                  href="https://app.kairosng.com/auth/onboarding/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[#C2185B] text-white px-5 py-3 rounded-full text-sm font-medium text-center"
                >
                  {getSignupText()}
                </a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
