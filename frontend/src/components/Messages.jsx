// src/pages/Messages.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Chat from '../components/Chat';

const Messages = () => {
  const [userId, setUserId] = useState(null);
  const [contactIds, setContactIds] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch userId from backend
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        console.log('Fetching userId...');
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          setLoading(false);
          return;
        }
        console.log('Token:', token); // Debug the token
        const response = await fetch('http://localhost:5000/api/auth/me', { // Updated port to 5000
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched userId:', data._id);
        setUserId(data._id);
      } catch (err) {
        console.error('Failed to fetch userId:', err);
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  // Fetch conversations from Firestore
  useEffect(() => {
    if (!userId) {
      console.log('Waiting for userId...');
      return;
    }

    console.log('Fetching conversations for userId:', userId);
    const conversationsRef = collection(db, 'conversations');
    const unsubscribe = onSnapshot(conversationsRef, async (snapshot) => {
      console.log('Conversations snapshot:', snapshot.docs.map(doc => doc.id));
      const contactIdsSet = new Set();
      for (const doc of snapshot.docs) {
        const [id1, id2] = doc.id.split('_');
        const otherId = id1 === userId ? id2 : id1;
        if (otherId === userId) continue;
        const messagesRef = collection(db, 'conversations', doc.id, 'messages');
        const messagesSnapshot = await messagesRef.get();
        console.log(`Messages for conversation ${doc.id}:`, messagesSnapshot.docs.map(doc => doc.data()));
        if (!messagesSnapshot.empty) {
          contactIdsSet.add(otherId);
        }
      }
      const contactIdsArray = Array.from(contactIdsSet);
      console.log('Fetched contactIds:', contactIdsArray);
      setContactIds(contactIdsArray);
      setLoading(false);
    }, (err) => {
      console.error('Failed to fetch conversations:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Fetch user details for contacts
  useEffect(() => {
    if (contactIds.length === 0) {
      console.log('No contactIds to fetch user details for');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        console.log('Fetching user details for contactIds:', contactIds);
        const response = await fetch(`http://localhost:5000/api/users?ids=${contactIds.join(',')}`); // Updated port to 5000
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        const map = users.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {});
        console.log('Fetched userMap:', map);
        setUserMap(map);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    };

    fetchUserDetails();
  }, [contactIds]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Error: Could not load user. Please log in again.</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-200">
        <h1 className="text-2xl font-semibold p-4 border-b border-gray-200">Messages</h1>
        {contactIds.length === 0 ? (
          <div className="p-4 text-gray-500">No conversations yet.</div>
        ) : (
          <ul>
            {contactIds.map((contactId) => (
              <li
                key={contactId}
                onClick={() => {
                  console.log('Selected contact:', contactId);
                  setSelectedContact(contactId);
                }}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedContact === contactId ? 'bg-gray-200' : ''
                }`}
              >
                {userMap[contactId] ? `${userMap[contactId].firstName} ${userMap[contactId].lastName}` : 'Loading...'}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex-1">
        {selectedContact ? (
          <Chat userId={userId} contactId={selectedContact} userMap={userMap} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;