"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Reply, Ban, BarChart3 } from "lucide-react";

export default function SMSCampaignStats() {
  const [stats, setStats] = useState({
    sent: 20,
    delivered: 20,
    replies: 5,
    optOuts: 1,
    conversionRate: 20,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        sent: prev.sent + Math.floor(Math.random() * 10),
        delivered: prev.delivered + Math.floor(Math.random() * 9),
        replies: prev.replies + Math.floor(Math.random() * 3),
        optOuts: prev.optOuts + (Math.random() > 0.8 ? 1 : 0),
        conversionRate: parseFloat((prev.replies / prev.delivered * 100).toFixed(1)),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const deliveryRate = ((stats.delivered / stats.sent) * 100).toFixed(1);
  const replyRate = ((stats.replies / stats.delivered) * 100).toFixed(1);
  const optOutRate = ((stats.optOuts / stats.delivered) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="jarvis-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jarvis-cyan/10">
            <MessageSquare className="w-6 h-6 text-jarvis-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">SMS Campaign</h2>
            <p className="text-sm text-gray-400">Text message outreach</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-jarvis-green" />
          <span className="text-jarvis-green text-sm">{replyRate}% reply rate</span>
        </div>
      </div>

      <div className="space-y-4">
        <StatRow
          icon={<Send className="w-4 h-4" />}
          label="Messages Sent"
          value={stats.sent.toLocaleString()}
          color="text-jarvis-blue"
          bgColor="bg-jarvis-blue/10"
        />
        <StatRow
          icon={<MessageSquare className="w-4 h-4" />}
          label="Delivered"
          value={stats.delivered.toLocaleString()}
          subValue={`${deliveryRate}%`}
          color="text-jarvis-green"
          bgColor="bg-jarvis-green/10"
        />
        <StatRow
          icon={<Reply className="w-4 h-4" />}
          label="Replies"
          value={stats.replies.toLocaleString()}
          subValue={`${replyRate}%`}
          color="text-jarvis-cyan"
          bgColor="bg-jarvis-cyan/10"
        />
        <StatRow
          icon={<Ban className="w-4 h-4" />}
          label="Opt-outs"
          value={stats.optOuts.toLocaleString()}
          subValue={`${optOutRate}%`}
          color="text-jarvis-red"
          bgColor="bg-jarvis-red/10"
        />
      </div>

      <div className="mt-4 p-3 rounded-lg bg-jarvis-cyan/5 border border-jarvis-cyan/20">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Conversion Rate</span>
          <span className="text-2xl font-bold text-jarvis-cyan font-mono">{stats.conversionRate}%</span>
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
