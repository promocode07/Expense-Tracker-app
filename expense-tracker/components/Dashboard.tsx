"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AnalyticsBoard from "@/components/AnalyticsBoard";
import RecentTransactions from "@/components/RecentTransactions";
import SmsInput from "@/components/SmsInput";

export default function Dashboard() {
  const [budget, setBudget] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]); 

  
  const refreshAllData = () => {
    fetchSettings();
    fetchRecentExpenses();
    fetchAllExpenses();
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from('user_settings').select('monthly_budget').limit(1).single();
    if (data) setBudget(data.monthly_budget);
  };

  const fetchRecentExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setRecentTransactions(data);
  };

  // 2. Fetch all expenses for the analytics board
  const fetchAllExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
    if (data) setAllTransactions(data);
  };

  // 3. Trigger the refresh when the page loads
  useEffect(() => {
    refreshAllData();
  }, []);

  const handleUpdateBudget = async (newBudget: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingSettings } = await supabase.from('user_settings').select('id').eq('user_id', user.id).single();

    let error;
    if (existingSettings) {
      const { error: updateError } = await supabase.from('user_settings').update({ monthly_budget: newBudget }).eq('id', existingSettings.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('user_settings').insert([{ monthly_budget: newBudget }]);
      error = insertError;
    }

    if (error) {
      alert("Failed to save budget: " + error.message);
    } else {
      setBudget(newBudget);
    }
  };

  // 4. Restored the Delete Function
  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      // 5. Instantly update both the recent list AND the total board!
      refreshAllData(); 
    }
  };

  return (
    <div className="w-full max-w-md pb-12">
      <div className="flex justify-between items-center mb-6 mt-8">
        <h1 className="text-3xl font-bold text-white">Tracker</h1>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="text-sm text-slate-400 hover:text-white"
        >
          Sign Out
        </button>
      </div>
      
      {/* Analytics gets ALL transactions */}
      <AnalyticsBoard transactions={allTransactions} budget={budget} onUpdateBudget={handleUpdateBudget} />
      
      {/* SMS Input triggers a full refresh when saved */}
      <SmsInput onSaveSuccess={refreshAllData} />
      
      {/* Recent Transactions only gets the top 5, and we restored the onDelete prop */}
      <RecentTransactions data={recentTransactions} />
    </div>
  );
}