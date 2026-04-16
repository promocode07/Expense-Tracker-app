"use client";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  created_at: string;
}

interface RecentTransactionsProps {
  data: Transaction[];
 onDelete: (id: string) => void;
}

export default function RecentTransactions({ data, onDelete }: RecentTransactionsProps) {
  return (
    <div className="mt-8 mb-8">
      <h2 className="text-xl font-bold mb-4 text-white">Top 5 latest Transactions</h2>
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-slate-500 text-sm">No expenses recorded yet.</p>
        ) : (
          data.map((tx) => (
            <div key={tx.id} className="bg-slate-900 p-4 rounded-lg flex justify-between items-center border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">{tx.merchant}</p>
                <p className="text-xs text-slate-500">
                  {new Date(tx.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="font-bold text-red-400">- ₹{tx.amount}</p>
              <button onClick={() => onDelete(tx.id)} className="text-xs text-red-500 hover:text-red-400">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}