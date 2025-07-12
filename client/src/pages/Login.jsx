import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useState } from 'react';

function Login({ setUsername, setRole, setLoginStatus }) {
  const [username, setUsernameLocal] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 👈 for redirection

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 👈 include cookies in the request
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // alert('✅ Login successful!');
        setUsername(data.data.username);
        setRole(data.data.role); // kalau kamu punya role, pastikan dikirim dari backend
        setLoginStatus(true);
        navigate('/'); // 👈 redirect to Home
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
          <input type="text" id="username" className="form-input" placeholder="Enter your username"
            value={username} onChange={(e) => setUsernameLocal(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" id="password" className="form-input" placeholder="Enter your password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className='paragraph'>Doesn't have any account? <Link to="/register" className='register'
          setUsername={setUsername}
          setRole={setRole}
          setLoginStatus={setLoginStatus}>Sign In</Link></p>
      </form>
    </div>
  );
}

export default Login;
