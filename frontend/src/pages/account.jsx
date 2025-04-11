import LoginForm from '../components/Auth/loginForm';
import './account.css';

const Account = () => {
    return (
        <div className="account-container">
            <div className="login-form-container">
            <LoginForm />
            </div>
        </div>
    );
};

export default Account;