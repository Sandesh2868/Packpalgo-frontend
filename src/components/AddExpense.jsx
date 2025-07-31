import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddExpense({ groupId, members }) {
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAddExpense = async () => {
    if (!payer || !amount || !description) return alert("Fill all fields");

    const splitAmount = parseFloat(amount) / members.length;

    await addDoc(collection(db, `groups/${groupId}/expenses`), {
      payer,
      amount: parseFloat(amount),
      description,
      splitAmount,
      date: serverTimestamp()
    });

    alert("Expense added!");
    setPayer('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className="p-4 border-t">
      <h3 className="font-semibold">Add Expense</h3>
      <input className="border p-2 my-2 w-full" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="border p-2 my-2 w-full" placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select className="border p-2 w-full" value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="">Select Payer</option>
        {members.map((m, i) => <option key={i} value={m}>{m}</option>)}
      </select>
      <button onClick={handleAddExpense} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">Add Expense</button>
    </div>
  );
}
