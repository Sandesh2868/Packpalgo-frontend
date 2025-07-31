import React, { useState } from 'react';
import { db } from '../../../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function GroupInfo({ group }) {
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(group.budget || '');

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    alert('Invite code copied to clipboard! 📋');
  };

  const shareGroup = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${group.name} on GoSplit`,
        text: `I've created a travel group "${group.name}" on GoSplit. Join using invite code: ${group.inviteCode}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `Join "${group.name}" on GoSplit!\n\nInvite Code: ${group.inviteCode}\n\nLink: ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard! 📋');
    }
  };

  const updateBudget = async () => {
    try {
      const budgetValue = parseFloat(newBudget) || null;
      await updateDoc(doc(db, 'groups', group.id), {
        budget: budgetValue
      });
      setEditingBudget(false);
      alert('Budget updated successfully! 💰');
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Error updating budget. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date.toDate ? date.toDate() : new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Group Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-4xl">{group.emoji}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
            <p className="text-gray-600">Created {formatDate(group.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{group.members.length}</div>
            <div className="text-sm text-gray-600">Members</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{group.totalExpenses || 0}</div>
            <div className="text-sm text-gray-600">Expenses</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(group.totalAmount || 0)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Budget Management */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Budget Management</h3>
          <button
            onClick={() => setEditingBudget(!editingBudget)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {editingBudget ? 'Cancel' : group.budget ? 'Edit' : 'Set Budget'}
          </button>
        </div>

        {editingBudget ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount (₹)
              </label>
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="Enter budget amount"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={updateBudget}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Save Budget
              </button>
              <button
                onClick={() => setEditingBudget(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {group.budget ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700">Budget:</span>
                  <span className="text-xl font-bold text-gray-800">{formatCurrency(group.budget)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${
                      ((group.totalAmount || 0) / group.budget) > 0.9
                        ? 'bg-red-500'
                        : ((group.totalAmount || 0) / group.budget) > 0.7
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(((group.totalAmount || 0) / group.budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Spent: {formatCurrency(group.totalAmount || 0)}</span>
                  <span>Remaining: {formatCurrency(Math.max(group.budget - (group.totalAmount || 0), 0))}</span>
                </div>
                <div className="text-center text-sm text-gray-500 mt-1">
                  {((group.totalAmount || 0) / group.budget * 100).toFixed(1)}% used
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-gray-600">No budget set for this group</p>
                <p className="text-sm text-gray-500">Set a budget to track your spending</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Members</h3>
        <div className="space-y-3">
          {group.members.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{member}</div>
                  <div className="text-sm text-gray-500">
                    {group.memberEmails[index] || 'Member'}
                    {group.createdByEmail === group.memberEmails[index] && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Creator
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite & Share */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Invite More Members</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Invite Code:</span>
              <button
                onClick={() => setShowInviteCode(!showInviteCode)}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                {showInviteCode ? 'Hide' : 'Show'}
              </button>
            </div>
            {showInviteCode && (
              <div className="flex items-center space-x-3">
                <code className="flex-1 bg-white p-3 rounded border font-mono text-lg tracking-widest text-center">
                  {group.inviteCode}
                </code>
                <button
                  onClick={copyInviteCode}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded transition duration-200"
                >
                  📋 Copy
                </button>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={shareGroup}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>📤</span>
              <span>Share Group</span>
            </button>
            <button
              onClick={copyInviteCode}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>📋</span>
              <span>Copy Code</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>How to invite:</strong><br/>
            Share the invite code or group link with friends. They can join by entering the code in the "Join Group" section.
          </p>
        </div>
      </div>

      {/* Group Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency((group.totalAmount || 0) / group.members.length)}
            </div>
            <div className="text-sm text-gray-600">Per Person</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency((group.totalAmount || 0) / Math.max(group.totalExpenses || 1, 1))}
            </div>
            <div className="text-sm text-gray-600">Avg Expense</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {Math.ceil((Date.now() - (group.createdAt?.toDate?.()?.getTime() || Date.now())) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-600">Days Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {group.budget ? `${((group.totalAmount || 0) / group.budget * 100).toFixed(0)}%` : '—'}
            </div>
            <div className="text-sm text-gray-600">Budget Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}