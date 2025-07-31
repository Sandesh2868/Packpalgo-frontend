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

// ==============================
// firebase.js
// ==============================
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_app.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_app.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
