import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function BalanceSummary({ groupId, members }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `groups/${groupId}/expenses`), (snap) => {
      const data = snap.docs.map(doc => doc.data());
      setExpenses(data);
    });
    return () => unsub();
  }, [groupId]);

  const balances = {};
  members.forEach(m => balances[m] = 0);

  expenses.forEach(exp => {
    const eachOwes = exp.splitAmount;
    members.forEach(member => {
      if (member === exp.payer) {
        balances[member] += (exp.amount - eachOwes);
      } else {
        balances[member] -= eachOwes;
      }
    });
  });

  return (
    <div className="p-4 border-t mt-4">
      <h3 className="font-semibold">Balances</h3>
      {Object.entries(balances).map(([member, balance], i) => (
        <p key={i} className="my-1">
          {member}: {balance.toFixed(2)} {balance >= 0 ? '(To Receive)' : '(To Pay)'}
        </p>
      ))}
    </div>
  );
}
