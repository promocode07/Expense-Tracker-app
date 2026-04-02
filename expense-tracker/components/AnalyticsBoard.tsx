"use client";
import { useState } from "react";

interface Transaction {
  amount: number;
}

interface AnalyticsBoardProps {
  transactions: Transaction[];
  budget: number;
  onUpdateBudget: (newBudget: number) => void; 
}

export default function AnalyticsBoard({ transactions, budget, onUpdateBudget }: AnalyticsBoardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(budget.toString());

  // ✅ THE FIX: We add up 'tx.amount', because that matches the database column!
  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const balance = budget - totalSpent;

  const handleSave = () => {
    onUpdateBudget(Number(editValue));
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-8 mt-4">
      {/* Box 1: Budget */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-1">
          <p className="text-slate-500 text-sm font-semibold">Budget</p>
          {!isEditing && (
            <button onClick={() => { setIsEditing(true); setEditValue(budget.toString()); }} className="text-xs text-blue-400 hover:text-blue-300">
              Edit
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex space-x-2">
            <input 
              type="number" 
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-slate-800 text-white rounded p-1 text-sm outline-none border border-slate-700 focus:border-blue-500"
            />
            <button onClick={handleSave} className="bg-blue-600 text-white px-2 rounded text-xs font-bold hover:bg-blue-700">
              Save
            </button>
          </div>
        ) : (
          <p className="text-2xl font-bold text-slate-200">₹{budget}</p>
        )}
      </div>

      {/* Box 2: Total Spent */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <p className="text-slate-500 text-sm font-semibold mb-1">Spent</p>
        <p className="text-2xl font-bold text-red-400">₹{totalSpent}</p>
      </div>

      {/* Box 3: Balance */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <p className="text-slate-500 text-sm font-semibold mb-1">Balance</p>
        <p className={`text-2xl font-bold ${balance < 0 ? 'text-red-500' : 'text-green-400'}`}>
          ₹{balance}
        </p>
      </div>
    </div>
  );
}