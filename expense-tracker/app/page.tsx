"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AnalyticsBoard from "@/Components/AnalyticsBoard";
import RecentTransactions from "@/Components/RecentTransactions";
import SmsInput from "@/Components/SmsInput";

export default function Home() {
  
  // 1. The Global State (The Manager's Clipboard)
  const [budget, setBudget] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  // 2. The Fetching Logic
  const fetchSettings = async () => {
    const { data } = await supabase.from('user_settings').select('monthly_budget').limit(1).single();
    if (data) setBudget(data.monthly_budget);
  };

  const fetchRecentExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setRecentTransactions(data);
  };

  // Run once on load
  useEffect(() => {
    fetchSettings();
    fetchRecentExpenses();
  }, []);

  // 3. The UI Layout
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white flex flex-col items-center">
      <div className="w-full max-w-md">
        
        <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
        
        {/* Pass down the budget and the transactions */}
        <AnalyticsBoard transactions={recentTransactions} budget={budget} />
        
        {/* Pass down the refresh function! */}
        <SmsInput onSaveSuccess={fetchRecentExpenses} />
        
        {/* Pass down the transactions */}
        <RecentTransactions data={recentTransactions} />
        
      </div>
    </main>
  );
}