"use client";
import { useEffect, useState } from "react";
import { parseUPIAmount, extractMerchant } from "@/lib/parser";
import { supabase } from "@/lib/supabase";


interface smsInputProps {
    onSaveSuccess: ()=> void;
}

export default function SmsInput ({onSaveSuccess}: smsInputProps){
     const [smsInput, setSmsInput] = useState("");
  const [extractedData, setExtractedData] = useState<{amount: number, merchant: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleProcess = async () => {
    const amount = parseUPIAmount(smsInput);
    const merchant = extractMerchant(smsInput);
    
    {isSaving ? "Saving..." : "Process SMS"}

    if (amount) {
      setExtractedData({ amount, merchant });
      setIsSaving(true);

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
        
        // Clear the box for the next text

        onSaveSuccess();
      }

    } else {
      alert("Could not find an amount in that text!");
    }
  };

  return (
    <div className="w-full space-y-4">
      <textarea 
        className="w-full p-4 bg-slate-900 border border-slate-800 rounded-lg h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
        placeholder="Paste your UPI SMS here..."
        value={smsInput}
        onChange={(e) => setSmsInput(e.target.value)}
      />
      
      <button 
        onClick={handleProcess}
        disabled={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-3 rounded-lg font-bold transition-all text-white"
      >
        {isSaving ? "Saving to Cloud..." : "Process SMS"}
      </button>

      {extractedData && !isSaving && (
        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg mt-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-green-400 font-bold">Data Saved!</p>
          <p className="text-slate-200">Amount: ₹{extractedData.amount}</p>
          <p className="text-slate-200">Merchant: {extractedData.merchant}</p>
        </div>
      )}
    </div>
  );

}