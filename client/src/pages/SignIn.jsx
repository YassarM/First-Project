import '../css/Signin.css';
import { useState } from 'react';
import { data, Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

function Signin({ setUsername, setRole, setLoginStatus }) {
    const [username, setUsernameLocal] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRoleLocal] = useState('Guest');
    const [usernameTaken, setUsernameTaken] = useState(false);
    const navigate = useNavigate(); // 👈 for redirection
    const handleAddUser = async (e) => {
        e.preventDefault();
        const response = await registerUser({ username, role, password });
        if (!response.success) {
            setUsernameTaken(true);
        }
        alert(response.data.user.username + " has been registered successfully");
        console.log(response);
        setUsername(response.data.user.username);
        setRole(response.data.user.role);
        setLoginStatus(true);
        navigate('/'); // 👈 redirect to login page after successful registration
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Sign In Form</h1>
            <form className="login-form" onSubmit={handleAddUser}>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" id="username" className="form-input" placeholder="Enter your username"
                        value={username} onChange={(e) => setUsernameLocal(e.target.value)} />
                        {usernameTaken && 
                        <p className="error-message">⚠️ Username has been taken</p>
                        }
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" className="form-input" placeholder="Enter your password"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="login-button" >Signin</button>
                <p className='paragraph'>Already have an account? <Link to="/login"> Login</Link></p>
            </form>
        </div>
    );
}

export default Signin;
