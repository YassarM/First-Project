import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { tryLogin } from '../api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await tryLogin(username,password)
      if (data.data.LoggedIn) {
        login(data.data.data); // ✅ CALL login() from context
        // Redirect based on role
        switch (data.data.data.role) {
          case 'Admin':
            navigate('/adminPage');
            break;
          case 'Panitia':
            navigate('/panitiaPage');
            break;
          case 'Juri':
            navigate('/juri-page');
            break;
          case 'Pelatih':
            navigate('/pelatih-page');
            break;
          default:
            navigate('/');
        }
      } else {
        alert('❌ Login failed: ' + data.error);
      }
    } catch (err) {
      console.error('❌ Error logging in:', err);
      alert('Server error');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login Form</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className="paragraph">
          Don't have an account?{' '}
          <Link to="/register" className="register">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
