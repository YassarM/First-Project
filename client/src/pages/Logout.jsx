import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // adjust the path as needed

function Logout() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

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
          logout(); // context logout
          setTimeout(() => navigate('/login'), 1500); // redirect after 1.5s
        } else {
          setMessage('❌ Logout failed.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        setMessage('⚠️ An error occurred while logging out.');
      }
    };

    logoutUser();
  }, [logout, navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
      <p>{message}</p>
    </div>
  );
}

export default Logout;
