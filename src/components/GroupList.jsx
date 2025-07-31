import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['']);

  const handleAddMember = () => setMembers([...members, '']);
  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleCreateGroup = async () => {
    if (!groupName) return alert("Enter group name");
    const docRef = await addDoc(collection(db, 'groups'), {
      groupName,
      members,
      createdAt: serverTimestamp()
    });
    alert(`Group "${groupName}" created! ID: ${docRef.id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Create Group</h2>
      <input
        className="border p-2 my-2 w-full"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <h3 className="font-semibold mt-4">Members</h3>
      {members.map((m, i) => (
        <input
          key={i}
          className="border p-2 my-1 w-full"
          placeholder={`Member ${i + 1}`}
          value={m}
          onChange={(e) => handleMemberChange(i, e.target.value)}
        />
      ))}
      <button onClick={handleAddMember} className="bg-blue-500 text-white px-4 py-1 mt-2 rounded">+ Add Member</button>
      <br />
      <button onClick={handleCreateGroup} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">Create Group</button>
    </div>
  );
}
