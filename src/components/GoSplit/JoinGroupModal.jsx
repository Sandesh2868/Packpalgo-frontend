import React, { useState } from 'react';
import { db } from '../../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';

export default function JoinGroupModal({ isOpen, onClose }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      alert('Please enter an invite code');
      return;
    }

    if (!user) {
      alert('Please sign in to join a group');
      return;
    }

    setLoading(true);

    try {
      // Search for group with this invite code
      const q = query(
        collection(db, 'groups'),
        where('inviteCode', '==', inviteCode.toUpperCase().trim())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert('Invalid invite code. Please check and try again.');
        setLoading(false);
        return;
      }

      const groupDoc = querySnapshot.docs[0];
      const groupData = groupDoc.data();
      
      // Check if user is already a member
      if (groupData.memberEmails.includes(user.email)) {
        alert('You are already a member of this group!');
        setLoading(false);
        return;
      }

      // Add user to the group
      await updateDoc(doc(db, 'groups', groupDoc.id), {
        memberEmails: arrayUnion(user.email),
        members: arrayUnion(user.displayName || user.email)
      });

      alert(`Successfully joined "${groupData.name}"! 🎉`);
      
      // Reset form and close modal
      setInviteCode('');
      onClose();
      
      // Trigger a page refresh to show the new group
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Error joining group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{backgroundColor: 'var(--bg)', color: 'var(--text)'}}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold" style={{color: 'var(--text)'}}>Join Group</h2>
            <button
              onClick={onClose}
              className="hover:opacity-70 text-xl sm:text-2xl"
              style={{color: 'var(--text)'}}
            >
              ×
            </button>
          </div>

          {/* Illustration */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-4xl sm:text-6xl mb-4">📨</div>
            <p className="text-sm sm:text-base" style={{color: 'var(--text)'}}>
              Enter the invite code shared by your group organizer to join their travel group.
            </p>
          </div>

          {/* Invite Code Input */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium mb-1 sm:mb-2" style={{color: 'var(--text)'}}>
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              className="w-full p-3 sm:p-4 text-center text-lg sm:text-xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent tracking-widest"
              maxLength={6}
              style={{ letterSpacing: '0.3em', color: 'black', backgroundColor: 'white' }}
            />
            <p className="text-xs mt-2 text-center" style={{color: 'var(--text)'}}>
              Code format: ABC123 (6 characters)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 text-xs sm:text-sm whitespace-nowrap"
              style={{color: 'var(--text)', backgroundColor: 'var(--bg)'}}
            >
              Cancel
            </button>
            <button
              onClick={handleJoinGroup}
              disabled={loading || !inviteCode.trim() || inviteCode.length !== 6}
              className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition duration-200 flex items-center justify-center text-xs sm:text-sm whitespace-nowrap"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              ) : (
                'Join Group'
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm" style={{color: 'var(--text)'}}>
              <strong>Don't have an invite code?</strong><br/>
              Ask the group creator to share their 6-character invite code with you, 
              or create your own group instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}