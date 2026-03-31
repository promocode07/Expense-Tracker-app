"use client";
// 👉 Runs on browser (needed for useState)

import { useState } from "react";

// 🧩 Transaction type (each transaction has amount)
interface Transaction {
  amount: number;
}

// 🧩 Props for this component
interface AnalyticsBoardProps {
  transactions: Transaction[]; // list of transactions
  budget: number;              // current budget
  onUpdateBudget: (newBudget: number) => void; 
  // 👉 function passed from parent to update budget
}

// 🔵 Main Component
export default function AnalyticsBoard({ transactions, budget, onUpdateBudget }: AnalyticsBoardProps) {

  // 🟢 Local UI state (only for this component)

  // Controls whether we are editing or not
  const [isEditing, setIsEditing] = useState(false);

  // Stores the input value while editing
  // Converted to string because input fields work with strings
  const [editValue, setEditValue] = useState(budget.toString());


  // 🧠 Calculate total spent
  const totalSpent = transactions.reduce(
    (sum, tx) => sum + tx.amount, 
    0
  );

  // 🧠 Calculate balance
  const balance = budget - totalSpent;


  // 🧠 Save handler (called when user clicks "Save")
  const handleSave = () => {

    // Convert string → number and send to parent
    onUpdateBudget(Number(editValue));

    // Exit editing mode
    setIsEditing(false);
  };


  // 🎨 UI
  return (
    <div className="grid grid-cols-3 gap-4 mb-8 mt-4">
      
      {/* 🟦 Box 1: Budget (Editable) */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col justify-center">
        
        {/* Header with label + edit button */}
        <div className="flex justify-between items-center mb-1">
          
          <p className="text-slate-500 text-sm font-semibold">
            Budget
          </p>

          {/* Show Edit button only if NOT editing */}
          {!isEditing && (
            <button 
              onClick={() => { 
                setIsEditing(true);                  // enter edit mode
                setEditValue(budget.toString());     // reset input value
              }} 
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
          )}
        </div>
        

        {/* 🔀 Conditional UI */}
        {isEditing ? (
          // 👉 Editing mode
          <div className="flex space-x-2">

            {/* Input field */}
            <input 
              type="number" 
              value={editValue}
              // Update local state on typing
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-slate-800 text-white rounded p-1 text-sm outline-none border border-slate-700 focus:border-blue-500"
            />

            {/* Save button */}
            <button 
              onClick={handleSave} 
              className="bg-blue-600 text-white px-2 rounded text-xs font-bold hover:bg-blue-700"
            >
              Save
            </button>
          </div>

        ) : (
          // 👉 Display mode
          <p className="text-2xl font-bold text-slate-200">
            ₹{budget}
          </p>
        )}
      </div>


      {/* 🟥 Box 2: Total Spent */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <p className="text-slate-500 text-sm font-semibold mb-1">
          Spent
        </p>
        <p className="text-2xl font-bold text-red-400">
          ₹{totalSpent}
        </p>
      </div>


      {/* 🟩 Box 3: Balance */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <p className="text-slate-500 text-sm font-semibold mb-1">
          Balance
        </p>

        {/* Dynamic color based on balance */}
        <p className={`text-2xl font-bold ${
          balance < 0 ? 'text-red-500' : 'text-green-400'
        }`}>
          ₹{balance}
        </p>
      </div>

    </div>
  );
}