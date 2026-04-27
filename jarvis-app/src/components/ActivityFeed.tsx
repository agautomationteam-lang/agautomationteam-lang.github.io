"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Phone, MessageSquare, Mail, DollarSign, UserPlus, AlertTriangle } from "lucide-react";

interface ActivityItem {
  id: number;
  type: "call" | "sms" | "email" | "sale" | "lead" | "alert";
  message: string;
  timestamp: Date;
}

const activityTypes = {
  call: { icon: <Phone className="w-4 h-4" />, color: "text-jarvis-purple", bg: "bg-jarvis-purple/10" },
  sms: { icon: <MessageSquare className="w-4 h-4" />, color: "text-jarvis-cyan", bg: "bg-jarvis-cyan/10" },
  email: { icon: <Mail className="w-4 h-4" />, color: "text-jarvis-pink", bg: "bg-jarvis-pink/10" },
  sale: { icon: <DollarSign className="w-4 h-4" />, color: "text-jarvis-green", bg: "bg-jarvis-green/10" },
  lead: { icon: <UserPlus className="w-4 h-4" />, color: "text-jarvis-blue", bg: "bg-jarvis-blue/10" },
  alert: { icon: <AlertTriangle className="w-4 h-4" />, color: "text-jarvis-yellow", bg: "bg-jarvis-yellow/10" },
};

// Real campaign data from Batch 1 (2026-04-26)
const campaignActivities = [
  { type: "call" as const, message: "Morgan called Action Furnace — Failed to connect" },
  { type: "call" as const, message: "Riley called Arpi's Industries — In progress" },
  { type: "call" as const, message: "Sarah called Knight Plumbing — Customer busy" },
  { type: "call" as const, message: "Chloe called ClearView Plumbing — Number not in service" },
  { type: "call" as const, message: "Emma called Horizon Heating — Customer ended call" },
  { type: "call" as const, message: "Michelle called JPS Home Heating — Failed to connect" },
  { type: "call" as const, message: "Jordan called Aspen Heating — Call queued" },
  { type: "call" as const, message: "Morgan called Challenger Heating — Call queued" },
  { type: "sms" as const, message: "SMS sent to Action Furnace (+14032360606)" },
  { type: "sms" as const, message: "SMS sent to Arpi's Industries (+14032362444)" },
  { type: "sms" as const, message: "SMS sent to Knight Plumbing (+15873172535)" },
  { type: "sms" as const, message: "SMS sent to ClearView Plumbing (+15873530773)" },
  { type: "sms" as const, message: "SMS sent to Horizon Heating (+14032586291)" },
  { type: "lead" as const, message: "Batch 1 launched: 20 HVAC leads from Calgary" },
  { type: "lead" as const, message: "562 total leads in database" },
  { type: "call" as const, message: "7 agents active: Morgan, Riley, Sarah, Chloe, Emma, Michelle, Jordan" },
];

const sampleMessages = {
  call: campaignActivities.filter(a => a.type === "call").map(a => a.message),
  sms: campaignActivities.filter(a => a.type === "sms").map(a => a.message),
  email: [
    "Email workflow active — SendGrid SMTP connected",
    "Email queued for interested leads",
    "Welcome sequence ready for demo bookings",
  ],
  sale: [
    "Demo booked: 0 (waiting for responses)",
    "Pipeline warming up",
    "Follow-up SMS driving conversions",
  ],
  lead: campaignActivities.filter(a => a.type === "lead").map(a => a.message),
  alert: [
    "2 numbers disconnected — normal in cold calling",
    "1 customer busy — will retry",
    "Batch 1 in progress",
  ],
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Initialize with some activities
    const initial: ActivityItem[] = Array.from({ length: 8 }, (_, i) => {
      const types = Object.keys(sampleMessages) as ActivityItem["type"][];
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        id: i,
        type,
        message: sampleMessages[type][Math.floor(Math.random() * sampleMessages[type].length)],
        timestamp: new Date(Date.now() - i * 60000),
      };
    });
    setActivities(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = Object.keys(sampleMessages) as ActivityItem["type"][];
      const type = types[Math.floor(Math.random() * types.length)];
      const newActivity: ActivityItem = {
        id: Date.now(),
        type,
        message: sampleMessages[type][Math.floor(Math.random() * sampleMessages[type].length)],
        timestamp: new Date(),
      };
      setActivities((prev) => [newActivity, ...prev].slice(0, 20));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="jarvis-panel p-6 col-span-full lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jarvis-blue/10">
            <Activity className="w-6 h-6 text-jarvis-blue" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Live Activity Feed</h2>
            <p className="text-sm text-gray-400">Real-time system events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-green animate-pulse" />
          <span className="text-jarvis-green text-sm">Live</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto activity-feed">
        <AnimatePresence>
          {activities.map((activity) => {
            const typeStyle = activityTypes[activity.type];
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${typeStyle.bg} ${typeStyle.color}`}>
                  {typeStyle.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{activity.message}</p>
                  <p className="text-xs text-gray-500">{formatTime(activity.timestamp)}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
