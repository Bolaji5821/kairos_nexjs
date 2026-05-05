"use client";

import { X, Briefcase, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface IntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (intent: "talent" | "company") => void;
}

export function IntentModal({ isOpen, onClose, onSelect }: IntentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/10 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </button>

            {/* Content */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="p-6 pb-4">
                <h2 className="text-xl font-bold dark:text-white text-center mb-2">
                  Welcome to Kairos
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
                  What brings you here today?
                </p>
              </div>

              {/* Options */}
              <div className="px-4 pb-4 space-y-3">
                {/* Talent Option */}
                <button
                  onClick={() => onSelect("talent")}
                  className="w-full group p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-[#C2185B] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Briefcase className="w-5 h-5 text-[#C2185B]" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-sm dark:text-white">
                        Find jobs
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Explore vetted remote roles
                      </p>
                    </div>
                  </div>
                </button>

                {/* Company Option */}
                <button
                  onClick={() => onSelect("company")}
                  className="w-full group p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-[#C2185B] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 text-[#C2185B]" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-sm dark:text-white">
                        Hire talent
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Discover vetted experts
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Footer Note */}
              <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
                  You can switch paths later
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}