import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import AddExpenseModal from './AddExpenseModal';
import ExpenseList from './ExpenseList';
import BalanceSummary from './BalanceSummary';
import GroupInfo from './GroupInfo';
import AuthWrapper from './AuthWrapper';

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses'); // expenses, balances, info

  useEffect(() => {
    if (!groupId) return;

    const unsubscribe = onSnapshot(doc(db, 'groups', groupId), (doc) => {
      if (doc.exists()) {
        setGroup({ id: doc.id, ...doc.data() });
      } else {
        // Group doesn't exist, redirect to groups list
        navigate('/gosplit');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId, navigate]);

  const handleInviteMember = async () => {
    if (!group || !user) return;

    const email = prompt('Enter email address to invite:');
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (group.memberEmails.includes(email)) {
      alert('This person is already a member of the group');
      return;
    }

    try {
      await updateDoc(doc(db, 'groups', groupId), {
        memberEmails: arrayUnion(email),
        members: arrayUnion(email) // Will be updated when they join
      });
      alert(`Invitation sent to ${email}! They can also join using invite code: ${group.inviteCode}`);
    } catch (error) {
      console.error('Error inviting member:', error);
      alert('Error sending invitation. Please try again.');
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    alert('Invite code copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Not Found</h2>
          <p className="text-gray-600 mb-4">The group you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/gosplit')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  // Check if user is a member of this group
  const isMember = user && group.memberEmails.includes(user.email);
  
  if (!isMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You are not a member of this group.</p>
          <button
            onClick={() => navigate('/gosplit')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/gosplit')}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ←
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{group.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
                  <p className="text-gray-600">{group.members.length} members</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={copyInviteCode}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Copy Code</span>
              </button>
              <button
                onClick={handleInviteMember}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Invite</span>
              </button>
              <button
                onClick={() => setShowAddExpense(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                <span>💰</span>
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Budget Progress (if budget is set) */}
          {group.budget && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Budget Usage</span>
                <span className="text-sm text-gray-600">
                  ₹{group.totalAmount || 0} / ₹{group.budget}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    ((group.totalAmount || 0) / group.budget) > 0.9
                      ? 'bg-red-500'
                      : ((group.totalAmount || 0) / group.budget) > 0.7
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(((group.totalAmount || 0) / group.budget) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((group.totalAmount || 0) / group.budget * 100).toFixed(1)}% used
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            {[
              { key: 'expenses', label: 'Expenses', icon: '💰' },
              { key: 'balances', label: 'Balances', icon: '⚖️' },
              { key: 'info', label: 'Group Info', icon: 'ℹ️' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 px-6 text-center transition duration-200 ${
                  activeTab === tab.key
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'expenses' && <ExpenseList groupId={groupId} />}
            {activeTab === 'balances' && <BalanceSummary groupId={groupId} group={group} />}
            {activeTab === 'info' && <GroupInfo group={group} />}
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <AddExpenseModal
            isOpen={showAddExpense}
            onClose={() => setShowAddExpense(false)}
            groupId={groupId}
            members={group.members}
          />
        )}
        </div>
      </div>
    </AuthWrapper>
  );
}