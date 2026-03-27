"use client";
import { useEffect, useState } from "react";
import { parseUPIAmount, extractMerchant } from "@/lib/parser";
import { supabase } from "@/lib/supabase";
import RecentTransactions from "@/Components/RecentTransactions";

export default function Home() {
  const [smsInput, setSmsInput] = useState("");
  const [extractedData, setExtractedData] = useState<{amount: number, merchant: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [recentTransactions, setTransactions] = useState<any[]>([]);
  const [extractionvisible, setExtractionVisible] = useState(false);
  //function to fetch 5 recent trasactions from Database

  const fetchRecentExpenses = async () => {
    const {data, error} = await supabase
    .from('expenses')
    .select('*')
    .order('created_at',{ascending: false})
    .limit(5);

    if(data) {
      setTransactions(data);
    }
    else if(error) {
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchRecentExpenses();
  },[]
  );


  const handleProcess = async () => {
    const amount = parseUPIAmount(smsInput);
    const merchant = extractMerchant(smsInput);
    
    {isSaving ? "Saving..." : "Process SMS"}

    if (amount) {
      setExtractedData({ amount, merchant });
      setIsSaving(true);
      setExtractionVisible(true);

      //send to supabase
      const {error} = await supabase
      .from('expenses')
      .insert([{amount: amount, merchant:merchant, raw_sms:smsInput}])

      setIsSaving(false);

      if (error) {
        alert("Failed to save to database: " + error.message);
      } else {
        alert("✅ Expense saved successfully!");
        setSmsInput("");
        fetchRecentExpenses();
        setExtractionVisible(false); // Clear the box for the next text
      }

    } else {
      alert("Could not find an amount in that text!");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Expense Tracker</h1>

      <div className="w-full max-w-md space-y-4">
        <textarea 
          className="w-full p-4 bg-slate-900 border border-slate-800 rounded-lg h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Paste your UPI SMS here..."
          value={smsInput}
          onChange={(e) => setSmsInput(e.target.value)}
        />
        
        <button 
          onClick={handleProcess}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all"
        >
          Process SMS
        </button>
        <RecentTransactions data={recentTransactions} />
                {extractedData && extractionvisible && (
          <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg mt-4 animate-in fade-in slide-in-from-top-2">
            <p className="text-green-400 font-bold">Data Detected!</p>
            <p>Amount: ₹{extractedData.amount}</p>
            <p>Merchant: {extractedData.merchant}</p>
          </div>
        )}
      </div>
    </main>
  );
}