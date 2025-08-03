import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) {
        setGroups([]);
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'groups'));
        const allGroups = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter groups where user is either member or creator
        const userGroups = allGroups.filter(group =>
          group.memberEmails?.includes(user.email)
        );

        setGroups(userGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user, refreshKey]);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  if (loading) return <div>Loading groups...</div>;

  return (
    <div className="group-list-container">
      <h2>My Groups</h2>

      {groups.length === 0 ? (
        <p>You have not joined or created any groups yet.</p>
      ) : (
        <ul>
          {groups.map(group => (
            <li
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              className="group-list-item"
            >
              <strong>{group.name}</strong>
              <div>{group.description}</div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setShowCreateModal(true)}>Create Group</button>
        <button onClick={() => setShowJoinModal(true)}>Join Group</button>
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => {
            setShowCreateModal(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => {
            setShowJoinModal(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}
