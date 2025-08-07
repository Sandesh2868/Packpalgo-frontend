import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';

export default function AddExpenseModal({ isOpen, onClose, groupId, members }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    payer: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});
  const [sharesSplits, setSharesSplits] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'Food', emoji: '🍽️', color: 'bg-orange-200 text-orange-800' },
    { value: 'Transport', emoji: '🚗', color: 'bg-blue-200 text-blue-800' },
    { value: 'Accommodation', emoji: '🏠', color: 'bg-green-200 text-green-800' },
    { value: 'Activities', emoji: '🎢', color: 'bg-purple-200 text-purple-800' },
    { value: 'Shopping', emoji: '🛍️', color: 'bg-pink-200 text-pink-800' },
    { value: 'Entertainment', emoji: '🎬', color: 'bg-yellow-200 text-yellow-800' },
    { value: 'Medical', emoji: '⚕️', color: 'bg-red-200 text-red-800' },
    { value: 'Other', emoji: '📋', color: 'bg-gray-200 text-gray-800' }
  ];

  useEffect(() => {
    if (splitType === 'custom') {
      const initialCustom = {};
      members.forEach(member => {
        initialCustom[member] = '';
      });
      setCustomSplits(initialCustom);
    } else if (splitType === 'shares') {
      const initialShares = {};
      members.forEach(member => {
        initialShares[member] = '1';
      });
      setSharesSplits(initialShares);
    }
  }, [splitType, members]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomSplitChange = (member, value) => {
    setCustomSplits(prev => ({ ...prev, [member]: value }));
  };

  const handleSharesSplitChange = (member, value) => {
    setSharesSplits(prev => ({ ...prev, [member]: value }));
  };

  const calculateSplits = () => {
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) return {};

    switch (splitType) {
      case 'equal':
        const equalShare = amount / members.length;
        const equalSplits = {};
        members.forEach(member => {
          equalSplits[member] = equalShare;
        });
        return equalSplits;

      case 'shares':
        const totalShares = Object.values(sharesSplits).reduce((sum, share) => sum + parseFloat(share || 0), 0);
        if (totalShares === 0) return {};
        const sharesSplitsResult = {};
        members.forEach(member => {
          const memberShares = parseFloat(sharesSplits[member] || 0);
          sharesSplitsResult[member] = (amount * memberShares) / totalShares;
        });
        return sharesSplitsResult;

      case 'custom':
        const customSplitsResult = {};
        members.forEach(member => {
          customSplitsResult[member] = parseFloat(customSplits[member] || 0);
        });
        return customSplitsResult;

      default:
        return {};
    }
  };

  const validateSplits = () => {
    const amount = parseFloat(formData.amount);
    const splits = calculateSplits();
    const totalSplit = Object.values(splits).reduce((sum, split) => sum + split, 0);

    if (splitType === 'custom') {
      const difference = Math.abs(amount - totalSplit);
      if (difference > 0.01) {
        return `Total splits (₹${totalSplit.toFixed(2)}) must equal the expense amount (₹${amount.toFixed(2)})`;
      }
    }

    const hasNegative = Object.values(splits).some(split => split < 0);
    if (hasNegative) {
      return 'Split amounts cannot be negative';
    }

    return null;
  };

  const handleAddExpense = async () => {
    if (!formData.description.trim()) return alert('Please enter a description');
    if (!formData.amount || parseFloat(formData.amount) <= 0) return alert('Please enter a valid amount');
    if (!formData.payer) return alert('Please select who paid');

    const splitError = validateSplits();
    if (splitError) return alert(splitError);

    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const splits = calculateSplits();

      const expenseData = {
        description: formData.description.trim(),
        amount,
        payer: formData.payer,
        category: formData.category,
        date: new Date(formData.date),
        notes: formData.notes.trim(),
        splitType,
        splits,
        createdAt: serverTimestamp(),
        groupId
      };

      const expenseRef = await addDoc(collection(db, 'groups', groupId, 'expenses'), expenseData);

      await updateDoc(doc(db, 'groups', groupId), {
        totalExpenses: increment(1),
        totalAmount: increment(amount)
      });

      setFormData({
        description: '',
        amount: '',
        payer: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setSplitType('equal');
      setCustomSplits({});
      setSharesSplits({});
      setLoading(false);
      onClose();
      setTimeout(() => alert('Expense added successfully! 💰'), 100);

    } catch (error) {
      console.error('Error adding expense:', error);
      alert(`Error adding expense: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const splits = calculateSplits();
  const splitError = validateSplits();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Expense</h2>
            <button onClick={onClose} className="text-2xl hover:opacity-70">×</button>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="e.g., Dinner at beach restaurant"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paid by *</label>
                <select
                  value={formData.payer}
                  onChange={(e) => handleInputChange('payer', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                >
                  <option value="">Select payer</option>
                  {members.map((member, i) => (
                    <option key={i} value={member}>{member}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleInputChange('category', category.value)}
                    className={`rounded-lg p-2 text-center text-xs ${category.color} ${
                      formData.category === category.value
                        ? 'ring-2 ring-indigo-400 border border-indigo-500'
                        : 'border border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg mb-1">{category.emoji}</div>
                    <div>{category.value}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
          </div>

          {/* Split Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">How to split?</label>
            <div className="flex flex-col sm:flex-row sm:space-x-3 mb-4">
              {[
                { key: 'equal', label: 'Split Equally', icon: '⚖️' },
                { key: 'shares', label: 'By Shares', icon: '📊' },
                { key: 'custom', label: 'Custom Amounts', icon: '✏️' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSplitType(option.key)}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm ${
                    splitType === option.key
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg">{option.icon}</div>
                  {option.label}
                </button>
              ))}
            </div>

            {/* Breakdown */}
            {formData.amount && parseFloat(formData.amount) > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Split breakdown:</h4>
                {splitType === 'equal' && members.map(member => (
                  <div key={member} className="flex justify-between">
                    <span>{member}</span>
                    <span className="font-medium">₹{(parseFloat(formData.amount) / members.length).toFixed(2)}</span>
                  </div>
                ))}

                {splitType === 'shares' && members.map(member => (
                  <div key={member} className="flex items-center justify-between mb-2">
                    <span>{member}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={sharesSplits[member] || ''}
                        onChange={(e) => handleSharesSplitChange(member, e.target.value)}
                        className="w-20 p-2 border border-gray-300 rounded text-right bg-white text-black"
                      />
                      <span>shares</span>
                      <span className="font-medium">₹{splits[member]?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                ))}

                {splitType === 'custom' && members.map(member => (
                  <div key={member} className="flex items-center justify-between mb-2">
                    <span>{member}</span>
                    <input
                      type="number"
                      min="0"
                      value={customSplits[member] || ''}
                      onChange={(e) => handleCustomSplitChange(member, e.target.value)}
                      className="w-24 p-2 border border-gray-300 rounded text-right bg-white text-black"
                      placeholder="0.00"
                    />
                  </div>
                ))}

                {splitType === 'custom' && (
                  <div className="flex justify-between border-t pt-2 mt-2 font-medium">
                    <span>Total:</span>
                    <span className={`${splitError ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{Object.values(splits).reduce((sum, s) => sum + s, 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {splitError && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
                    {splitError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any extra info..."
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white text-black hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExpense}
              disabled={loading || splitError || !formData.description.trim() || !formData.amount || !formData.payer}
              className="flex-1 py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding...
                </>
              ) : (
                'Add Expense'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
