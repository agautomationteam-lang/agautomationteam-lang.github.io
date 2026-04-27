"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Target } from "lucide-react";

export default function RevenueCounter() {
  const [revenue, setRevenue] = useState(34750);
  const target = 50000;
  const progress = (revenue / target) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue((prev) => {
        const increment = Math.random() * 50;
        return Math.min(prev + increment, target);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="jarvis-panel p-6 col-span-full lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jarvis-blue/10">
            <DollarSign className="w-6 h-6 text-jarvis-blue" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Live Revenue</h2>
            <p className="text-sm text-gray-400">Real-time earnings tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-jarvis-green" />
          <span className="text-jarvis-green text-sm">+12.5%</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white font-mono glow-text">
            ${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-gray-400 text-lg">/ ${target.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress to Goal</span>
          <span className="text-jarvis-blue font-mono">{progress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>${(target - revenue).toLocaleString()} remaining</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
