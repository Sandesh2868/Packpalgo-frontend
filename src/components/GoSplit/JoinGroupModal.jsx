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
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Error joining group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Join Group</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Illustration */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📨</div>
            <p className="text-gray-600">
              Enter the invite code shared by your group organizer to join their travel group.
            </p>
          </div>

          {/* Invite Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              className="w-full p-4 text-center text-xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent tracking-widest"
              maxLength={6}
              style={{ letterSpacing: '0.3em' }}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Code format: ABC123 (6 characters)
            </p>
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
              onClick={handleJoinGroup}
              disabled={loading || !inviteCode.trim() || inviteCode.length !== 6}
              className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Join Group'
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
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