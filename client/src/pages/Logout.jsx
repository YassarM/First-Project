import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setRole, setUsername, setLoggedInStatus }) {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        console.log('Sending logout request...');
        const response = await fetch('http://localhost:5000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          setMessage('✅ You have been logged out.');
          setRole(null);       // Reset role
          setUsername('');     // Reset username
          setLoggedInStatus(false); // Reset login status
          setTimeout(() => navigate('/login'), 1500); // Redirect after 1.5 sec
        } else {
          setMessage('❌ Logout failed.');
        }
      } catch (error) {
        
        console.error('Error during logout:', error);
        setMessage('⚠️ An error occurred while logging out.');
      }
    };

    logoutUser();
  }, [navigate, setRole, setUsername]);

  return (
    <div>
      <h1>Logging out...</h1>
      <p>{message}</p>
    </div>
  );
}

export default Logout;
