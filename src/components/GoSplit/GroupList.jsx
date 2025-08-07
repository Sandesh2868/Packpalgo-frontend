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
  const [refreshKey, setRefreshKey] = useState(0);
  const [signingIn, setSigningIn] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const refreshGroups = () => setRefreshKey(prev => prev + 1);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  useEffect(() => {
    if (!user?.email) {
      setGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
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
    }, (error) => {
      console.error('Error fetching groups:', error);
      setGroups([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, refreshKey]);

  const handleGroupClick = (groupId) => {
    navigate(`/gosplit/group/${groupId}`); // ✅ fixed template literal
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-3xl font-bold mb-4">Welcome to GoSplit</h1>
          <p className="mb-6">
            Split travel expenses with your friends and family. Sign in to get started.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-black">
            <strong>📱 Your Data is Safe:</strong><br />
            All your groups and expenses are stored securely in the cloud.
            When you sign in, you'll see all your data exactly as you left it.
          </div>
          
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center space-x-3 mb-4"
          >
            {signingIn ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-500">Or use the sign in button in the top right corner of the main page.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">GoSplit</h1>
              <p className="text-sm sm:text-base">Split expenses with your travel groups</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button onClick={refreshGroups} className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base">
                <span>🔄</span><span>Refresh</span>
              </button>
              <button onClick={() => setShowJoinModal(true)} className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base">
                <span>📨</span><span>Join Group</span>
              </button>
              <button onClick={() => setShowCreateModal(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base">
                <span>➕</span><span>Create Group</span>
              </button>
            </div>
          </div>
        </div>

        {/* Group Cards */}
        {groups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
            <div className="text-4xl sm:text-6xl mb-4">🏖️</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No Groups Yet</h3>
            <p className="mb-6 text-sm sm:text-base">Create your first travel group or join an existing one to start splitting expenses!</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button onClick={() => setShowCreateModal(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">Create First Group</button>
              <button onClick={() => setShowJoinModal(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">Join a Group</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {groups.map(group => (
              <div key={group.id} onClick={() => handleGroupClick(group.id)} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl transition duration-200 transform hover:-translate-y-1" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold truncate flex-1 mr-2">{group.name || group.groupName || 'Unnamed Group'}</h3>
                  <span className="text-xl sm:text-2xl flex-shrink-0">{group.emoji || '🌍'}</span>
                </div>
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <div className="flex items-center"><span className="mr-2">👥</span>{group.memberEmails?.length || 0} members</div>
                  <div className="flex items-center"><span className="mr-2">💰</span>{group.totalExpenses || 0} expenses</div>
                  {group.budget && (
                    <div className="flex items-center"><span className="mr-2">🎯</span>Budget: ₹{group.budget}</div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Created {group.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                  <span className="text-indigo-500 font-medium">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateGroupModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setTimeout(() => refreshGroups(), 500);
            }}
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
