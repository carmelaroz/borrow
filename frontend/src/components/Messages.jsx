import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Chat from '../components/Chat';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, auth, loading: authLoading } = useAuthContext();

  // Check authentication and set user ID
  useEffect(() => {
    console.log('=== Authentication Debug Info ===');
    console.log('Auth Loading:', authLoading);
    console.log('Auth Object:', auth ? 'Present' : 'Missing');
    console.log('Auth Instance:', auth);
    console.log('Context User:', user ? user : 'Missing');

    if (!db) {
      setError('Firebase is not properly initialized.');
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log('Firebase Auth State:', firebaseUser ? `User ${firebaseUser.uid}` : 'No user');
      console.log('Current Firebase User:', auth.currentUser);

      if (firebaseUser) {
        const uid = firebaseUser.uid;
        console.log('=== Connected Firebase User Details ===');
        console.log('UID:', uid);
        console.log('Email:', firebaseUser.email);
        console.log('Display Name:', firebaseUser.displayName);
        console.log('Full Firebase User Object:', firebaseUser);
        setUserId(uid);
        setLoading(false);
      } else {
        console.log('No authenticated Firebase user found.');
        console.log('Context User Details:', user);
        setError('Please log in to view messages. If you believe you are logged in, try logging out and back in.');
        setLoading(false);
      }
    }, (error) => {
      console.error('Auth state error:', error);
      setError('Authentication error: ' + error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, authLoading]);

  // Fetch conversations and user data
  useEffect(() => {
    if (!userId) return;

    let unsubscribe;
    const fetchConversations = async () => {
      try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, where('participants', 'array-contains', userId));

        unsubscribe = onSnapshot(q, async (snapshot) => {
          const conversationsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('Fetched Conversations:', conversationsData);

          const contactIds = conversationsData
            .map((conv) => conv.participants.find((id) => id !== userId))
            .filter(Boolean);

          if (contactIds.length > 0) {
            try {
              const response = await axios.get(
                `/api/users?ids=${contactIds.join(',')}`,
                {
                  headers: {
                    Authorization: `Bearer ${user?.token}`,
                  },
                }
              );

              const userData = response.data.reduce((acc, user) => {
                const mongoUser = user.user || user;
                const userId = mongoUser._id?.$oid || mongoUser._id;
                if (userId) {
                  acc[userId] = {
                    firstName: mongoUser.firstName || mongoUser.displayName || 'Unknown',
                    lastName: mongoUser.lastName || '',
                  };
                }
                return acc;
              }, {});

              setUserMap(userData);
              setConversations(conversationsData);
            } catch (apiError) {
              console.error('Error fetching user data:', apiError);
              setError('Failed to fetch user data: ' + apiError.message);
            }
          } else {
            setConversations([]);
          }
          setLoading(false);
        }, (error) => {
          console.error('Firebase snapshot error:', error);
          setError('Failed to fetch conversations: ' + error.message);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error in fetchConversations:', err);
        setError('Error fetching conversations: ' + err.message);
        setLoading(false);
      }
    };

    fetchConversations();
    return () => unsubscribe && unsubscribe();
  }, [userId, user]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen">
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