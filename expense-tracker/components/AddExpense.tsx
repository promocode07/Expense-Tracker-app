"use client";
import { useState } from "react";

interface AddExpenseProps {
  onAdd: (merchant: string, amount: number) => Promise<void>;
}

export default function AddExpense({ onAdd }: AddExpenseProps) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from refreshing when you hit submit
    if (!merchant || !amount) return;

    setLoading(true);
    // 1. Hand the data up to the Manager!
    await onAdd(merchant, Number(amount));
    
   
    setMerchant("");
    setAmount("");
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mb-6">
      <h2 className="text-sm font-semibold text-slate-400 mb-3">Add Manual Expense</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Merchant (e.g., Coffee)"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded p-2 text-white text-sm outline-none focus:border-blue-500"
          required
        />
        <input
          type="number"
          placeholder="₹ Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24 bg-slate-950 border border-slate-800 rounded p-2 text-white text-sm outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-800 hover:bg-blue-600 text-white px-4 rounded text-sm font-bold transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "+"}
        </button>
      </form>
    </div>
  );
}