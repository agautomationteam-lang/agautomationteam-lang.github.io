"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Search, Filter, Globe, TrendingUp } from "lucide-react";

export default function LeadScraperStats() {
  const [stats, setStats] = useState({
    dailyLeads: 147,
    totalLeads: 12480,
    enriched: 8930,
    qualified: 3420,
    sources: [
      { name: "Google Maps", count: 45, icon: "🗺️" },
      { name: "LinkedIn", count: 32, icon: "💼" },
      { name: "Yellow Pages", count: 28, icon: "📒" },
      { name: "Industry DB", count: 42, icon: "🏭" },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const newDaily = prev.dailyLeads + Math.floor(Math.random() * 3);
        return {
          ...prev,
          dailyLeads: newDaily,
          totalLeads: prev.totalLeads + Math.floor(Math.random() * 2),
          enriched: prev.enriched + Math.floor(Math.random() * 2),
          qualified: prev.qualified + (Math.random() > 0.7 ? 1 : 0),
          sources: prev.sources.map((s) => ({
            ...s,
            count: s.count + Math.floor(Math.random() * 2),
          })),
        };
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const enrichmentRate = ((stats.enriched / stats.totalLeads) * 100).toFixed(1);
  const qualificationRate = ((stats.qualified / stats.enriched) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="jarvis-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jarvis-green/10">
            <Database className="w-6 h-6 text-jarvis-green" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Lead Scraper</h2>
            <p className="text-sm text-gray-400">Automated lead generation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-jarvis-green" />
          <span className="text-jarvis-green text-sm">+{stats.dailyLeads} today</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-4 rounded-lg bg-jarvis-blue/5 border border-jarvis-blue/20">
          <Search className="w-5 h-5 text-jarvis-blue mx-auto mb-2" />
          <div className="text-3xl font-bold text-white font-mono">{stats.totalLeads.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Total Leads</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-jarvis-green/5 border border-jarvis-green/20">
          <Filter className="w-5 h-5 text-jarvis-green mx-auto mb-2" />
          <div className="text-3xl font-bold text-white font-mono">{stats.qualified.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Qualified</div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Enrichment Rate</span>
            <span className="text-jarvis-blue font-mono">{enrichmentRate}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill"
              style={{ width: `${enrichmentRate}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Qualification Rate</span>
            <span className="text-jarvis-green font-mono">{qualificationRate}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill bg-gradient-to-r from-jarvis-green to-jarvis-cyan"
              style={{ width: `${qualificationRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Lead Sources</h3>
        {stats.sources.map((source) => (
          <div
            key={source.name}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-jarvis-cyan" />
              <span className="text-sm text-gray-300">{source.name}</span>
            </div>
            <span className="text-sm font-bold text-jarvis-cyan font-mono">{source.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
