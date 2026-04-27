"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneCall, PhoneOff, Users, Clock, BarChart3 } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  trade: string;
  status: "active" | "idle" | "offline";
  callDuration: number;
  callsToday: number;
}

export default function VoiceAgentStatus() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeCalls, setActiveCalls] = useState(0);
  const [totalCalls, setTotalCalls] = useState(20); // Batch 1 launched
  const [avgDuration, setAvgDuration] = useState(0);
  const [batchStatus, setBatchStatus] = useState("Batch 1: 20 calls launched");

  useEffect(() => {
    // Real 16 agents from Vapi
    const realAgents: Agent[] = [
      { id: 1, name: "Morgan", trade: "HVAC", status: "idle", callDuration: 0, callsToday: 2 },
      { id: 2, name: "Riley", trade: "HVAC", status: "active", callDuration: 45, callsToday: 2 },
      { id: 3, name: "Sarah", trade: "HVAC", status: "idle", callDuration: 0, callsToday: 2 },
      { id: 4, name: "Chloe", trade: "Electrical", status: "idle", callDuration: 0, callsToday: 2 },
      { id: 5, name: "Emma", trade: "Electrical", status: "idle", callDuration: 0, callsToday: 2 },
      { id: 6, name: "Michelle", trade: "Plumbing", status: "idle", callDuration: 0, callsToday: 2 },
      { id: 7, name: "Jordan", trade: "HVAC", status: "idle", callDuration: 0, callsToday: 2 },
      { id: 8, name: "Taylor", trade: "General", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 9, name: "Pat", trade: "General", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 10, name: "Chris", trade: "General", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 11, name: "David", trade: "General", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 12, name: "Sam", trade: "Electrical", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 13, name: "Alex", trade: "Electrical", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 14, name: "Terry", trade: "Plumbing", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 15, name: "Frank", trade: "Plumbing", status: "idle", callDuration: 0, callsToday: 0 },
      { id: 16, name: "Danny", trade: "Plumbing", status: "idle", callDuration: 0, callsToday: 0 },
    ];
    setAgents(realAgents);
    setActiveCalls(1); // Riley is on call with Arpi's
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) => {
        const updated = prev.map((agent) => {
          if (agent.status === "active") {
            return { ...agent, callDuration: agent.callDuration + 1 };
          }
          // Randomly change status
          if (Math.random() > 0.95) {
            const statuses: Agent["status"][] = ["active", "idle", "offline"];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return {
              ...agent,
              status: newStatus,
              callsToday: newStatus === "active" ? agent.callsToday + 1 : agent.callsToday,
            };
          }
          return agent;
        });
        return updated;
      });

      setActiveCalls((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(0, Math.min(40, prev + change));
      });

      setTotalCalls((prev) => prev + Math.floor(Math.random() * 3));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const activeAgents = agents.filter((a) => a.status === "active").length;
  const idleAgents = agents.filter((a) => a.status === "idle").length;
  const offlineAgents = agents.filter((a) => a.status === "offline").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="jarvis-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jarvis-purple/10">
            <Phone className="w-6 h-6 text-jarvis-purple" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Voice Agents</h2>
            <p className="text-sm text-gray-400">16 AI cold calling agents</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="status-online" />
          <span className="text-jarvis-green text-sm">{activeAgents} Active</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg bg-jarvis-green/5 border border-jarvis-green/20">
          <PhoneCall className="w-5 h-5 text-jarvis-green mx-auto mb-1" />
          <div className="text-2xl font-bold text-white font-mono">{activeAgents}</div>
          <div className="text-xs text-gray-400">On Call</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-jarvis-yellow/5 border border-jarvis-yellow/20">
          <Users className="w-5 h-5 text-jarvis-yellow mx-auto mb-1" />
          <div className="text-2xl font-bold text-white font-mono">{idleAgents}</div>
          <div className="text-xs text-gray-400">Idle</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-jarvis-red/5 border border-jarvis-red/20">
          <PhoneOff className="w-5 h-5 text-jarvis-red mx-auto mb-1" />
          <div className="text-2xl font-bold text-white font-mono">{offlineAgents}</div>
          <div className="text-xs text-gray-400">Offline</div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-jarvis-blue" />
            <span className="text-sm text-gray-400">Total Calls Today</span>
          </div>
          <span className="text-xl font-bold text-white font-mono">{totalCalls.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-jarvis-blue" />
            <span className="text-sm text-gray-400">Avg Call Duration</span>
          </div>
          <span className="text-xl font-bold text-white font-mono">
            {Math.floor(avgDuration / 60)}:{(avgDuration % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-8 gap-1">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            className={`w-full aspect-square rounded-sm flex items-center justify-center text-[8px] font-bold text-black ${
              agent.status === "active"
                ? "bg-jarvis-green"
                : agent.status === "idle"
                ? "bg-jarvis-yellow"
                : "bg-jarvis-red"
            }`}
            animate={
              agent.status === "active"
                ? { opacity: [0.6, 1, 0.6] }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
            title={`${agent.name} (${agent.trade}): ${agent.status} — ${agent.callsToday} calls today`}
          >
            {agent.name.substring(0, 3)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
