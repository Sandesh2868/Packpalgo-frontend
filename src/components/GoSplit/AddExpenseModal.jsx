import React, { useState } from 'react';
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

  const [splitType, setSplitType] = useState('equal'); // equal, shares, custom
  const [customSplits, setCustomSplits] = useState({});
  const [sharesSplits, setSharesSplits] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'Food', emoji: '🍽️', color: 'bg-orange-100 text-orange-800' },
    { value: 'Transport', emoji: '🚗', color: 'bg-blue-100 text-blue-800' },
    { value: 'Accommodation', emoji: '🏠', color: 'bg-green-100 text-green-800' },
    { value: 'Activities', emoji: '🎢', color: 'bg-purple-100 text-purple-800' },
    { value: 'Shopping', emoji: '🛍️', color: 'bg-pink-100 text-pink-800' },
    { value: 'Entertainment', emoji: '🎬', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Medical', emoji: '⚕️', color: 'bg-red-100 text-red-800' },
    { value: 'Other', emoji: '📋', color: 'bg-gray-100 text-gray-800' }
  ];

  // Initialize splits when members or split type changes
  React.useEffect(() => {
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
      if (difference > 0.01) { // Allow for small rounding errors
        return `Total splits (₹${totalSplit.toFixed(2)}) must equal the expense amount (₹${amount.toFixed(2)})`;
      }
    }

    // Check if any split is negative
    const hasNegative = Object.values(splits).some(split => split < 0);
    if (hasNegative) {
      return 'Split amounts cannot be negative';
    }

    return null;
  };

  const handleAddExpense = async () => {
    // Validation
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.payer) {
      alert('Please select who paid');
      return;
    }

    const splitError = validateSplits();
    if (splitError) {
      alert(splitError);
      return;
    }

    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const splits = calculateSplits();

      // Create expense document
      const expenseData = {
        description: formData.description.trim(),
        amount: amount,
        payer: formData.payer,
        category: formData.category,
        date: new Date(formData.date),
        notes: formData.notes.trim(),
        splitType: splitType,
        splits: splits,
        createdAt: serverTimestamp(),
        groupId: groupId
      };

      // Add expense to Firestore
      await addDoc(collection(db, 'groups', groupId, 'expenses'), expenseData);

      // Update group totals
      await updateDoc(doc(db, 'groups', groupId), {
        totalExpenses: increment(1),
        totalAmount: increment(amount)
      });

      // Reset form and close modal
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
      onClose();

      alert('Expense added successfully! 💰');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const splits = calculateSplits();
  const splitError = validateSplits();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="e.g., Dinner at beach restaurant"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid by *
              </label>
              <select
                value={formData.payer}
                onChange={(e) => handleInputChange('payer', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select payer</option>
                {members.map((member, index) => (
                  <option key={index} value={member}>{member}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleInputChange('category', category.value)}
                    className={`p-2 rounded-lg border-2 transition duration-200 text-xs ${
                      formData.category === category.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{category.emoji}</div>
                    <div>{category.value}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Split Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How to split?
            </label>
            
            <div className="flex space-x-3 mb-4">
              {[
                { key: 'equal', label: 'Split Equally', icon: '⚖️' },
                { key: 'shares', label: 'By Shares', icon: '📊' },
                { key: 'custom', label: 'Custom Amounts', icon: '✏️' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSplitType(option.key)}
                  className={`flex-1 p-3 rounded-lg border-2 transition duration-200 ${
                    splitType === option.key
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{option.icon}</div>
                  <div className="text-sm">{option.label}</div>
                </button>
              ))}
            </div>

            {/* Split Details */}
            {formData.amount && parseFloat(formData.amount) > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Split breakdown:</h4>
                
                {splitType === 'equal' && (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member} className="flex justify-between items-center">
                        <span className="text-gray-700">{member}</span>
                        <span className="font-medium">₹{(parseFloat(formData.amount) / members.length).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {splitType === 'shares' && (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member} className="flex items-center justify-between">
                        <span className="text-gray-700 flex-1">{member}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={sharesSplits[member] || ''}
                            onChange={(e) => handleSharesSplitChange(member, e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded text-center"
                            placeholder="1"
                          />
                          <span className="text-gray-500">shares</span>
                          <span className="font-medium w-20 text-right">
                            ₹{splits[member] ? splits[member].toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {splitType === 'custom' && (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member} className="flex items-center justify-between">
                        <span className="text-gray-700 flex-1">{member}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={customSplits[member] || ''}
                            onChange={(e) => handleCustomSplitChange(member, e.target.value)}
                            className="w-24 p-2 border border-gray-300 rounded text-right"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className={`font-medium ${splitError ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{Object.values(splits).reduce((sum, split) => sum + split, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {splitError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{splitError}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional details..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExpense}
              disabled={loading || splitError || !formData.description.trim() || !formData.amount || !formData.payer}
              className="flex-1 py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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