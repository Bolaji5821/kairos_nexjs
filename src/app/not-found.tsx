"use client";

import Link from "next/link";
import { Home, ArrowRight, Search, Clock, MapPin, Sparkles, Compass } from "lucide-react";
import { motion, Easing } from "framer-motion";

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

   const itemVariants = {
     hidden: { y: 30, opacity: 0 },
     visible: {
       y: 0,
       opacity: 1,
       transition: {
         type: "spring" as const,
         stiffness: 100
       }
     }
   };

   const floatVariants = {
     float: {
       y: [0, -15, 0],
       rotate: [0, 2, -2, 0],
       transition: {
         duration: 4,
         repeat: Infinity,
         ease: [0.42, 0, 0.58, 1] as const
       }
     }
   };

  const suggestions = [
    { icon: Home, text: "Go back home", href: "/" },
    { icon: Search, text: "Browse jobs", href: "/jobs" },
    { icon: Compass, text: "Explore categories", href: "/categories" },
    { icon: MapPin, text: "How it works", href: "/how-it-works" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C2185B]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-3xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main content */}
        <div className="text-center mb-16">
          {/* Floating 404 */}
          <motion.div
            variants={floatVariants}
            animate="float"
            className="relative inline-block mb-8"
          >
            <div className="text-[12rem] sm:text-[16rem] lg:text-[20rem] font-black leading-none tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#C2185B] via-pink-500 to-pink-600">
                404
              </span>
            </div>
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-10 h-10 text-[#C2185B]" />
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold dark:text-white mb-4"
          >
            Oops! You&apos;ve found a <br />
            <span className="text-[#C2185B]">Kairos</span> moment that got away
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            The page you&apos;re looking for seems to have embarked on its own journey.
            Don&apos;t worry, your perfect opportunity is still out there!
          </motion.p>
        </div>

        {/* Quick actions grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
        >
          {suggestions.map((suggestion, index) => (
            <Link
              key={index}
              href={suggestion.href}
              className="group bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-[#C2185B]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-[#C2185B] transition-colors">
                  <suggestion.icon className="w-6 h-6 text-[#C2185B] group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <span className="font-semibold dark:text-white group-hover:text-[#C2185B] transition-colors">
                    {suggestion.text}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 ml-auto group-hover:text-[#C2185B] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Fun stats */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white to-[#C2185B]/5 dark:from-zinc-900 dark:to-zinc-950 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <motion.div
                className="text-3xl sm:text-4xl font-black text-[#C2185B]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                404
              </motion.div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Pages missed</p>
            </div>
            <div>
              <motion.div
                className="text-3xl sm:text-4xl font-black text-[#C2185B]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                ∞
              </motion.div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Opportunities waiting</p>
            </div>
            <div>
              <motion.div
                className="text-3xl sm:text-4xl font-black text-[#C2185B]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                1
              </motion.div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">You&apos;ve got this</p>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={itemVariants}
          className="text-center mt-12 text-zinc-400 text-sm"
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Remember: every missed opportunity is just a setup for your next Kairos moment.
        </motion.p>
      </motion.div>
    </div>
  );
}
