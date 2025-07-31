import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function BalanceSummary({ groupId, group }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    const unsubscribe = onSnapshot(collection(db, 'groups', groupId, 'expenses'), (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expensesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  // Calculate balances based on all expenses and their splits
  const calculateBalances = () => {
    const balances = {};
    
    // Initialize balances for all members
    group.members.forEach(member => {
      balances[member] = 0;
    });

    // Process each expense
    expenses.forEach(expense => {
      const { payer, amount, splits } = expense;
      
      // Payer paid the full amount
      balances[payer] += amount;
      
      // Subtract each member's share
      Object.entries(splits || {}).forEach(([member, owedAmount]) => {
        balances[member] -= owedAmount;
      });
    });

    return balances;
  };

  // Calculate who owes whom
  const calculateSettlements = (balances) => {
    const creditors = []; // People who are owed money
    const debtors = [];   // People who owe money

    Object.entries(balances).forEach(([member, balance]) => {
      if (balance > 0.01) { // They are owed money
        creditors.push({ member, amount: balance });
      } else if (balance < -0.01) { // They owe money
        debtors.push({ member, amount: Math.abs(balance) });
      }
    });

    // Sort by amount for optimal settlements
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      const settleAmount = Math.min(creditor.amount, debtor.amount);
      
      settlements.push({
        from: debtor.member,
        to: creditor.member,
        amount: settleAmount
      });

      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;

      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }

    return settlements;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const balances = calculateBalances();
  const settlements = calculateSettlements(balances);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Balances */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Individual Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(balances).map(([member, balance]) => (
            <div
              key={member}
              className={`p-4 rounded-lg border-2 ${
                Math.abs(balance) < 0.01
                  ? 'border-gray-200 bg-gray-50'
                  : balance > 0
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {Math.abs(balance) < 0.01 ? '✅' : balance > 0 ? '💰' : '💸'}
                  </span>
                  <span className="font-medium text-gray-800">{member}</span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    Math.abs(balance) < 0.01
                      ? 'text-gray-600'
                      : balance > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {formatCurrency(Math.abs(balance))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.abs(balance) < 0.01
                      ? 'All settled up'
                      : balance > 0
                      ? 'To receive'
                      : 'To pay'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement Suggestions */}
      {settlements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggested Settlements</h3>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <div className="text-gray-800">
                        <strong>{settlement.from}</strong> pays <strong>{settlement.to}</strong>
                      </div>
                      <div className="text-sm text-gray-500">Settle up payment</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-indigo-600">
                      {formatCurrency(settlement.amount)}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition duration-200">
                        UPI
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition duration-200">
                        Paytm
                      </button>
                      <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition duration-200">
                        GPay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{expenses.length}</div>
            <div className="text-sm text-gray-600">Total Expenses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0) / group.members.length)}
            </div>
            <div className="text-sm text-gray-600">Per Person</div>
          </div>
        </div>
      </div>

      {settlements.length === 0 && expenses.length > 0 && (
        <div className="text-center py-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">All Settled Up!</h3>
          <p className="text-gray-600">Everyone's balances are even. No settlements needed.</p>
        </div>
      )}
    </div>
  );
}
