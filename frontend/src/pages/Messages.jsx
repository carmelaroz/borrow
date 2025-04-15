// src/pages/Messages.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import axios from 'axios';
import Chat from '../components/Chat';
import { useAuthContext } from '../context/AuthContext';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, auth, loading: authLoading } = useAuthContext();

  // Check Firebase authentication
  useEffect(() => {
    if (authLoading) {
      console.log('Auth is still loading...');
      return;
    }

    if (!db) {
      setError('Firebase is not properly initialized.');
      setLoading(false);
      return;
    }

    if (!auth || !auth.currentUser) {
      setError('Please log in to view messages.');
      setLoading(false);
      return;
    }

    setUserId(auth.currentUser.uid);
    setLoading(false);
  }, [auth, user, authLoading]);

  // Fetch conversations and user data from MongoDB
  useEffect(() => {
    if (!userId) return;

    let unsubscribe;
    const fetchConversations = async () => {
      try {
        // Query Firestore conversations
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, where('participants', 'array-contains', userId));

        unsubscribe = onSnapshot(q, async (snapshot) => {
          const conversationsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Extract contact Firebase UIDs
          const contactIds = conversationsData
            .map((conv) => conv.participants.find((id) => id !== userId))
            .filter(Boolean);

          if (contactIds.length > 0) {
            try {
              const token = await auth.currentUser.getIdToken();
              // Fetch user data from MongoDB
              const response = await axios.get(
                `/api/users?firebaseUids=${contactIds.join(',')}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              // Map MongoDB users to userMap using firebaseUid
              const userData = response.data.reduce((acc, user) => {
                if (user.firebaseUid) {
                  acc[user.firebaseUid] = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                  };
                }
                return acc;
              }, {});

              setUserMap(userData);
              setConversations(conversationsData);
            } catch (apiError) {
              setError('Failed to fetch user data: ' + apiError.message);
            }
          } else {
            setConversations([]);
          }
          setLoading(false);
        }, (error) => {
          setError('Failed to fetch conversations: ' + error.message);
          setLoading(false);
        });
      } catch (err) {
        setError('Error fetching conversations: ' + err.message);
        setLoading(false);
      }
    };

    fetchConversations();
    return () => unsubscribe && unsubscribe();
  }, [userId, auth]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen">
      {/* Contact List */}
      <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Conversations</h2>
        {conversations.length === 0 ? (
          <p className="text-gray-500">No conversations yet</p>
        ) : (
          conversations.map((conversation) => {
            const contactId = conversation.participants.find((id) => id !== userId);
            return (
              <div
                key={conversation.id}
                onClick={() => setSelectedContact(contactId)}
                className={`p-3 cursor-pointer rounded-lg mb-2 ${
                  selectedContact === contactId ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                {userMap[contactId] ? (
                  <div>
                    <span className="font-medium">
                      {userMap[contactId].firstName} {userMap[contactId].lastName}
                    </span>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.text}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4">
        {selectedContact ? (
          <Chat userId={userId} contactId={selectedContact} userMap={userMap} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;