import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import LoginForm from '../components/Auth/loginForm';
import './account.css';
import { useNavigate } from 'react-router-dom';


const Account = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
        navigate('/dashboard'); // user is logged in, go to dashboard
        }
    }, [user, navigate]);
    
    return (
        <div className="account-container">
            <div className="login-form-container">
            {!user && <LoginForm />}
            </div>
        </div>
    );
};

export default Account;