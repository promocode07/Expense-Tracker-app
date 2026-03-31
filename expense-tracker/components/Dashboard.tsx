"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AnalyticsBoard from "@/components/AnalyticsBoard";
import RecentTransactions from "@/components/RecentTransactions";
import SmsInput from "@/components/SmsInput";

export default function Dashboard() {
  const [budget, setBudget] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  const fetchSettings = async () => {
    const { data } = await supabase.from('user_settings').select('monthly_budget').limit(1).single();
    if (data) setBudget(data.monthly_budget);
  };

  const fetchRecentExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setRecentTransactions(data);
  };

  // The Dashboard manages its own data loading!
  useEffect(() => {
    fetchSettings();
    fetchRecentExpenses();
  }, []);

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-6 mt-8">
        <h1 className="text-3xl font-bold text-white">Expense Tracker</h1>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="text-sm text-slate-400 hover:text-white"
        >
          Sign Out
        </button>
      </div>
      
      <AnalyticsBoard transactions={recentTransactions} budget={budget} />
      <SmsInput onSaveSuccess={fetchRecentExpenses} />
      <RecentTransactions data={recentTransactions} />
    </div>
  );
}