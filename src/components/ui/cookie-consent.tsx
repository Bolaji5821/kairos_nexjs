"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Cookie, Settings, CheckCircle2 } from "lucide-react";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [essentialOnly, setEssentialOnly] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential");
    setShowConsent(false);
    setShowManage(false);
  };

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    setShowConsent(false);
    setShowManage(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", essentialOnly ? "essential" : "all");
    setShowConsent(false);
    setShowManage(false);
  };

  if (!showConsent) return null;

  return (
    <>
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-[#C2185B]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold dark:text-white mb-2">
                  Cookie Consent
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  We use cookies to improve your experience on our platform. By continuing to use our website, you agree to our{" "}
                  <Link href="/privacy-policy" className="text-[#C2185B] font-bold hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms-of-service" className="text-[#C2185B] font-bold hover:underline">
                    Terms of Service
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowManage(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Manage Cookies
              </button>
              <button
                onClick={handleAcceptEssential}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C2185B] text-white font-bold text-sm hover:bg-[#A3154D] transition-colors shadow-lg shadow-pink-500/20"
              >
                Accept All
              </button>
              <button
                onClick={() => setShowConsent(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Preferences Modal */}
      {showManage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowManage(false)} />
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold dark:text-white">Cookie Preferences</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your cookie settings</p>
              </div>
              <button
                onClick={() => setShowManage(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Essential Cookies */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Essential Cookies
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Required for basic functionality. Always active.
                    </p>
                  </div>
                  <div className="w-12 h-7 bg-green-500 rounded-full relative cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Analytics & Performance */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold dark:text-white">
                      Analytics & Performance
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Help us improve our website and understand how users interact with it.
                    </p>
                  </div>
                  <button
                    onClick={() => setEssentialOnly(!essentialOnly)}
                    className={`w-12 h-7 rounded-full relative transition-colors ${essentialOnly ? "bg-zinc-300 dark:bg-zinc-700" : "bg-[#C2185B]"}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${essentialOnly ? "left-1" : "right-1"}`} />
                  </button>
                </div>
              </div>

              {/* Marketing */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold dark:text-white">
                      Marketing
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Used to deliver personalized ads and content relevant to you.
                    </p>
                  </div>
                  <button
                    onClick={() => setEssentialOnly(!essentialOnly)}
                    className={`w-12 h-7 rounded-full relative transition-colors ${essentialOnly ? "bg-zinc-300 dark:bg-zinc-700" : "bg-[#C2185B]"}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${essentialOnly ? "left-1" : "right-1"}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptEssential}
                className="flex-1 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 rounded-xl bg-[#C2185B] text-white font-bold text-sm hover:bg-[#A3154D] transition-colors shadow-lg shadow-pink-500/20"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
