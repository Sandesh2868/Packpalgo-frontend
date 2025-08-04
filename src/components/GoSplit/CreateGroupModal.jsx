import React, { useState } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';

export default function CreateGroupModal({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['']);
  const [budget, setBudget] = useState('');
  const [emoji, setEmoji] = useState('🌟');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const emojiOptions = ['🌟', '🏖️', '🗻', '🎒', '✈️', '🚗', '🏕️', '🌴', '🌊', '⛰️'];

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleRemoveMember = (index) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const generateInviteCode = () => {
    // Generate a 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (!user) {
      alert('Please sign in to create a group');
      return;
    }

    // Filter out empty member entries and validate emails
    const validMembers = members.filter(member => member.trim() !== '');
    const memberEmails = [user.email, ...validMembers];
    const memberNames = [user.displayName || user.email, ...validMembers];

    setLoading(true);

    try {
      const inviteCode = generateInviteCode();
      
      const groupData = {
        name: groupName.trim(),
        emoji: emoji,
        members: memberNames,
        memberEmails: memberEmails,
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: serverTimestamp(),
        inviteCode: inviteCode,
        budget: budget ? parseFloat(budget) : null,
        totalExpenses: 0,
        totalAmount: 0
      };

      console.log('Creating group with data:', groupData);
      const docRef = await addDoc(collection(db, 'groups'), groupData);
      console.log('Group created successfully with ID:', docRef.id);
      
      // Reset form first
      setGroupName('');
      setMembers(['']);
      setBudget('');
      setEmoji('🌟');
      setLoading(false);
      
      // Close modal before showing alert to prevent UI issues
      onClose();
      
      // Show success message with invite code
      setTimeout(() => {
        const successMessage = `Group "${groupName}" created successfully!

Invite Code: ${inviteCode}

Share this code with others to let them join your group.

The group will appear in your groups list once the data syncs.`;
        alert(successMessage);
      }, 100);
      
    } catch (error) {
      console.error('Error creating group:', error);
      let errorMessage = 'Error creating group. Please try again.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your authentication.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" style={{backgroundColor: 'var(--bg)', color: 'var(--text)'}}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold" style={{color: 'var(--text)'}}>Create New Group</h2>
            <button
              onClick={onClose}
              className="hover:opacity-70 text-xl sm:text-2xl"
              style={{color: 'var(--text)'}}
            >
              ×
            </button>
          </div>

          {/* Group Name */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-sm font-medium mb-1 sm:mb-2" style={{color: 'var(--text)'}}>
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Goa Trip 2024"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              style={{color: 'black', backgroundColor: 'white'}}
              maxLength={50}
            />
          </div>

          {/* Emoji Selection */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-sm font-medium mb-1 sm:mb-2" style={{color: 'var(--text)'}}>
              Group Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emojiOption) => (
                <button
                  key={emojiOption}
                  onClick={() => setEmoji(emojiOption)}
                  className={`text-xl sm:text-2xl p-2 rounded-lg border-2 transition duration-200 ${
                    emoji === emojiOption
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emojiOption}
                </button>
              ))}
            </div>
          </div>

          {/* Budget (Optional) */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-sm font-medium mb-1 sm:mb-2" style={{color: 'var(--text)'}}>
              Budget (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3" style={{color: 'gray'}}>₹</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="10000"
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={{color: 'black', backgroundColor: 'white'}}
              />
            </div>
            <p className="text-xs mt-1" style={{color: 'var(--text)'}}>Set a budget cap to track spending</p>
          </div>

          {/* Members */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium mb-1 sm:mb-2" style={{color: 'var(--text)'}}>
              Add Members (Optional)
            </label>
            <p className="text-xs mb-3" style={{color: 'var(--text)'}}>
              Add member emails or names. You can also invite them later using the invite code.
            </p>
            
            {members.map((member, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  placeholder="Email or name"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  style={{color: 'black', backgroundColor: 'white'}}
                />
                {members.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className="ml-2 text-red-500 hover:text-red-700 p-2"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={handleAddMember}
              className="text-indigo-500 hover:text-indigo-700 text-sm font-medium flex items-center mt-2"
            >
              <span className="mr-1">+</span> Add Another Member
            </button>
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
              onClick={handleCreateGroup}
              disabled={loading || !groupName.trim()}
              className="flex-1 py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 transition duration-200 flex items-center justify-center text-xs sm:text-sm whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}