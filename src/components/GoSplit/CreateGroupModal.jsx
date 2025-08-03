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
      
      // Close modal before showing alert to prevent UI issues
      onClose();
      
      // Show success message with invite code
      setTimeout(() => {
        alert(`Group "${groupName}" created successfully!\n\nInvite Code: ${inviteCode}\n\nShare this code with others to let them join your group.`);
      }, 100);
      
    } catch (error) {
      console.error('Error creating group:', error);
      alert(`Error creating group: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Group</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Group Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Goa Trip 2024"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              maxLength={50}
            />
          </div>

          {/* Emoji Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emojiOption) => (
                <button
                  key={emojiOption}
                  onClick={() => setEmoji(emojiOption)}
                  className={`text-2xl p-2 rounded-lg border-2 transition duration-200 ${
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="10000"
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Set a budget cap to track spending</p>
          </div>

          {/* Members */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-3">
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
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={loading || !groupName.trim()}
              className="flex-1 py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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