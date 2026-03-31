// 1. The Blueprint
interface Transaction {
  amount: number;
}

interface AnalyticsBoardProps {
  transactions: Transaction[];
  budget: number;
}

// 2. The Worker
export default function AnalyticsBoard({ transactions, budget }: AnalyticsBoardProps) {
  


  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const balance = budget - totalSpent;


  return (
    <div className="grid grid-cols-3 gap-4 mb-8 mt-4">
      
      {/* Box 1: Budget */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <p className="text-slate-500 text-sm font-semibold mb-1">Budget</p>
        <p className="text-2xl font-bold text-slate-200">₹{budget}</p>
      </div>

      {/* Box 2: Total Spent */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <p className="text-slate-500 text-sm font-semibold mb-1">Spent</p>
        <p className="text-2xl font-bold text-red-400">₹{totalSpent}</p>
      </div>

      {/* Box 3: Balance */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <p className="text-slate-500 text-sm font-semibold mb-1">Balance</p>
        {/* If balance goes below 0, turn it red, otherwise keep it green */}
        <p className={`text-2xl font-bold ${balance < 0 ? 'text-red-500' : 'text-green-400'}`}>
          ₹{balance}
        </p>
      </div>

    </div>
  );
}