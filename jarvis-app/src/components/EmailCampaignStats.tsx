"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Eye, MousePointer, BarChart3 } from "lucide-react";

export default function EmailCampaignStats() {
  const [stats, setStats] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    openRate: 0,
    clickRate: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const newSent = prev.sent + Math.floor(Math.random() * 15);
        const newOpened = prev.opened + Math.floor(Math.random() * 5);
        const newClicked = prev.clicked + Math.floor(Math.random() * 2);
        return {
          sent: newSent,
          opened: newOpened,
          clicked: newClicked,
          bounced: prev.bounced + (Math.random() > 0.9 ? 1 : 0),
          openRate: parseFloat(((newOpened / newSent) * 100).toFixed(1)),
          clickRate: parseFloat(((newClicked / newOpened) * 100).toFixed(1)),
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="jarvis-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jarvis-pink/10">
            <Mail className="w-6 h-6 text-jarvis-pink" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Email Campaign</h2>
            <p className="text-sm text-gray-400">Automated email sequences</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-jarvis-green" />
          <span className="text-jarvis-green text-sm">{stats.openRate}% open rate</span>
        </div>
      </div>

      <div className="space-y-4">
        <StatRow
          icon={<Send className="w-4 h-4" />}
          label="Emails Sent"
          value={stats.sent.toLocaleString()}
          color="text-jarvis-blue"
          bgColor="bg-jarvis-blue/10"
        />
        <StatRow
          icon={<Eye className="w-4 h-4" />}
          label="Opened"
          value={stats.opened.toLocaleString()}
          subValue={`${stats.openRate}%`}
          color="text-jarvis-green"
          bgColor="bg-jarvis-green/10"
        />
        <StatRow
          icon={<MousePointer className="w-4 h-4" />}
          label="Clicked"
          value={stats.clicked.toLocaleString()}
          subValue={`${stats.clickRate}%`}
          color="text-jarvis-pink"
          bgColor="bg-jarvis-pink/10"
        />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Open Rate</span>
            <span className="text-jarvis-green font-mono">{stats.openRate}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill"
              style={{ width: `${stats.openRate}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Click Rate</span>
            <span className="text-jarvis-pink font-mono">{stats.clickRate}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill bg-gradient-to-r from-jarvis-pink to-jarvis-purple"
              style={{ width: `${(stats.clickRate / stats.openRate) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatRow({
  icon,
  label,
  value,
  subValue,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${bgColor} ${color}`}>{icon}</div>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold font-mono ${color}`}>{value}</span>
        {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
      </div>
    </div>
  );
}
