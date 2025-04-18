import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return { 
                user: action.payload,
                auth: auth
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return { 
                user: null,
                auth: auth
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { 
        user: null,
        auth: auth
    });
    const [loading, setLoading] = useState(true);

    // Listen for Firebase auth state changes
    useEffect(() => {
        console.log('Setting up Firebase auth state listener');
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Firebase auth state changed:', firebaseUser);
            if (firebaseUser) {
                try {
                    // Get the MongoDB user data
                    const response = await fetch('http://localhost:5000/api/users/me', {
                        headers: {
                            Authorization: `Bearer ${firebaseUser.uid}`,
                        },
                    });
                    
                    if (response.ok) {
                        const mongoUser = await response.json();
                        // User is signed in with both Firebase and MongoDB
                        const userData = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                            token: firebaseUser.uid, // Use Firebase UID as token
                            user: mongoUser // Include MongoDB user data
                        };
                        dispatch({ 
                            type: 'LOGIN', 
                            payload: userData
                        });
                    } else {
                        throw new Error('Failed to fetch MongoDB user data');
                    }
                } catch (error) {
                    console.error('Error fetching MongoDB user:', error);
                    // Still allow Firebase auth but without MongoDB data
                    const userData = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        token: firebaseUser.uid
                    };
                    dispatch({ 
                        type: 'LOGIN', 
                        payload: userData
                    });
                }
            } else {
                // User is signed out
                dispatch({ type: 'LOGOUT' });
            }
            setLoading(false);
        });

        return () => {
            console.log('Cleaning up Firebase auth state listener');
            unsubscribe();
        };
    }, []);

    // Check for user in localStorage on app start
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            dispatch({ type: 'LOGIN', payload: storedUser });
        }
    }, []);

    const value = {
        ...state,
        dispatch,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};