import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function ExpenseList({ groupId }) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    payer: 'all',
    dateRange: 'all'
  });

  const categories = [
    { value: 'all', label: 'All Categories', emoji: '📋' },
    { value: 'Food', label: 'Food', emoji: '🍽️' },
    { value: 'Transport', label: 'Transport', emoji: '🚗' },
    { value: 'Accommodation', label: 'Accommodation', emoji: '🏠' },
    { value: 'Activities', label: 'Activities', emoji: '🎢' },
    { value: 'Shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'Entertainment', label: 'Entertainment', emoji: '🎬' },
    { value: 'Medical', label: 'Medical', emoji: '⚕️' },
    { value: 'Other', label: 'Other', emoji: '📋' }
  ];

  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, 'groups', groupId, 'expenses'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date)
      }));
      setExpenses(expensesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  useEffect(() => {
    // Apply filters
    let filtered = expenses;

    if (filters.category !== 'all') {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    if (filters.payer !== 'all') {
      filtered = filtered.filter(expense => expense.payer === filters.payer);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(expense => expense.date >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(expense => expense.date >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(expense => expense.date >= filterDate);
          break;
      }
    }

    setFilteredExpenses(filtered);
  }, [expenses, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getCategoryEmoji = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.emoji : '📋';
  };

  const getSplitTypeIcon = (splitType) => {
    switch (splitType) {
      case 'equal': return '⚖️';
      case 'shares': return '📊';
      case 'custom': return '✏️';
      default: return '⚖️';
    }
  };

  // Get unique payers for filter
  const uniquePayers = [...new Set(expenses.map(expense => expense.payer))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 sm:mb-6 space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Filter Expenses</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.emoji} {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payer Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Paid by</label>
            <select
              value={filters.payer}
              onChange={(e) => handleFilterChange('payer', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Members</option>
              {uniquePayers.map(payer => (
                <option key={payer} value={payer}>{payer}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">{filteredExpenses.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Expenses</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / Math.max(filteredExpenses.length, 1))}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Avg. Expense</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">
              {new Set(filteredExpenses.map(exp => exp.category)).size}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <div className="text-4xl sm:text-6xl mb-4">💸</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Expenses Found</h3>
          <p className="text-sm sm:text-base text-gray-600">
            {expenses.length === 0 
              ? "No expenses have been added yet. Add your first expense to get started!"
              : "No expenses match your current filters. Try adjusting your filter criteria."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 sm:space-x-3 flex-1">
                  <div className="text-xl sm:text-2xl">{getCategoryEmoji(expense.category)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{expense.description}</h4>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-green-600">{formatCurrency(expense.amount)}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {getSplitTypeIcon(expense.splitType)} {expense.splitType} split
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <span className="mr-1">💳</span>
                        Paid by <strong className="ml-1">{expense.payer}</strong>
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">📅</span>
                        {formatDate(expense.date)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-fit`}>
                        {expense.category}
                      </span>
                    </div>

                    {expense.notes && (
                      <div className="text-xs sm:text-sm text-gray-600 mb-3 italic">
                        "{expense.notes}"
                      </div>
                    )}

                    {/* Split Details */}
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Split Details:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2">
                        {Object.entries(expense.splits || {}).map(([member, amount]) => (
                          <div key={member} className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-gray-700 truncate mr-2">{member}</span>
                            <span className="font-medium text-gray-800 flex-shrink-0">{formatCurrency(amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}