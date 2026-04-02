"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import AnalyticsBoard from "@/components/AnalyticsBoard";
import RecentTransactions from "@/components/RecentTransactions";
import SmsInput from "@/components/SmsInput";

export default function Dashboard() {
  const [budget, setBudget] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  const fetchSettings = async () => {
    const { data } = await supabase.from('user_settings').select('monthly_budget').limit(1).single();
    if (data) setBudget(data.monthly_budget);
  };

  const fetchRecentExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setRecentTransactions(data);
  };

  const fetchAllExpenses = async () => {
    const { data} = await supabase.from('expenses').select('*').order('created_at', {ascending:false});
    if (data)
      setAllTransactions(data);
  }

  useEffect(() => {
    fetchSettings();
    fetchRecentExpenses();
  }, []);

  // NEW DATABASE LOGIC: Handle the budget update
  const handleUpdateBudget = async (newBudget: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Failsafe: Must be logged in

    // 1. Check if they already have a settings row
    const { data: existingSettings } = await supabase.from('user_settings').select('id').eq('user_id', user.id).single();

    let error; 
    if (existingSettings) {
      // 2. Update existing row
      const { error: updateError } = await supabase.from('user_settings').update({ monthly_budget: newBudget }).eq('id', existingSettings.id);
      error = updateError;
    } else {
      // 3. Insert new row
      const { error: insertError } = await supabase.from('user_settings').insert([{ monthly_budget: newBudget }]);
      error = insertError;
    }

    if (error) {
      alert("Failed to save budget: " + error.message);
    } else {
      // 4. Update the local UI state so it instantly reflects the change
      setBudget(newBudget);
    }
  };

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
      
      {/* Pass the new function down to the Worker! */}
      <AnalyticsBoard transactions={allTransactions} budget={budget} onUpdateBudget={handleUpdateBudget} />
      
      <SmsInput onSaveSuccess={fetchRecentExpenses} />
      <RecentTransactions data={recentTransactions} />
    </div>
  ); 
}