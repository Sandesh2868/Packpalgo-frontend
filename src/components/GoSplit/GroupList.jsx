import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Listen to groups where user is a member
    const q = query(
      collection(db, 'groups'),
      where('memberEmails', 'array-contains', user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroups(groupsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleGroupClick = (groupId) => {
    navigate(`/gosplit/group/${groupId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to sign in to access GoSplit</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to GoSplit</h1>
          <p className="text-gray-600 mb-8">
            Split travel expenses with your friends and family. Sign in to get started.
          </p>
          <p className="text-sm text-gray-500">
            Please sign in using the button in the top right corner of the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">GoSplit</h1>
                <p className="text-gray-600">Split expenses with your travel groups</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                >
                  <span>📨</span>
                  <span>Join Group</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>Create Group</span>
                </button>
              </div>
            </div>
          </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🏖️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Groups Yet</h3>
            <p className="text-gray-600 mb-6">Create your first travel group or join an existing one to start splitting expenses!</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition duration-200"
              >
                Create First Group
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition duration-200"
              >
                Join a Group
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">{group.name}</h3>
                  <span className="text-2xl">{group.emoji || '🌟'}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👥</span>
                    <span>{group.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">💰</span>
                    <span>{group.totalExpenses || 0} expenses</span>
                  </div>
                  {group.budget && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🎯</span>
                      <span>Budget: ₹{group.budget}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Created {group.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </div>
                  <div className="text-indigo-500 font-medium">View Details →</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateGroupModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {showJoinModal && (
          <JoinGroupModal
            isOpen={showJoinModal}
            onClose={() => setShowJoinModal(false)}
          />
        )}
      </div>
    </div>
  );
}