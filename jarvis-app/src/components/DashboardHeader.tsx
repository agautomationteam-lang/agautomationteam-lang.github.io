"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Shield, Clock } from "lucide-react";

export default function DashboardHeader() {
  const [time, setTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const cpuTimer = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30);
    }, 3000);
    return () => {
      clearInterval(timer);
      clearInterval(cpuTimer);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-jarvis-blue to-jarvis-purple flex items-center justify-center">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-jarvis-green border-2 border-jarvis-dark" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white font-mono glow-text">
              J.A.R.V.I.S.
            </h1>
            <p className="text-sm text-gray-400">AI Sales Automation System</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jarvis-panel border border-jarvis-border">
            <Zap className="w-4 h-4 text-jarvis-yellow" />
            <span className="text-sm text-gray-300">CPU: {cpuUsage}%</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jarvis-panel border border-jarvis-border">
            <Shield className="w-4 h-4 text-jarvis-green" />
            <span className="text-sm text-gray-300">Secure</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jarvis-panel border border-jarvis-border">
            <Clock className="w-4 h-4 text-jarvis-blue" />
            <span className="text-sm text-gray-300 font-mono">
              {time.toLocaleTimeString("en-US", { hour12: false })}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-jarvis-blue/50 to-transparent" />
    </motion.header>
  );
}
