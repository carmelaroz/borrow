import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload)); // <-- Save user
            return { 
                user: action.payload,
                auth: auth // Include the Firebase auth object
            };
        case 'LOGOUT':
            localStorage.removeItem('user'); // <-- Remove user
            return { 
                user: null,
                auth: auth // Keep the Firebase auth object
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { 
        user: null,
        auth: auth // Initialize with Firebase auth object
    });
    const [loading, setLoading] = useState(true);

    // Listen for Firebase auth state changes
    useEffect(() => {
        console.log('Setting up Firebase auth state listener');
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log('Firebase auth state changed:', firebaseUser);
            if (firebaseUser) {
                // User is signed in
                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                };
                dispatch({ 
                    type: 'LOGIN', 
                    payload: userData
                });
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