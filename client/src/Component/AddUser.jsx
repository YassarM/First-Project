import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { registerUser } from '../api';

import '../css/AddUser.css';
function AddUser() {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');

    const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, role, password });
      alert('User added successfully');
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan user');
    }
  };
    return <div className='add-user-page'>
        <form className='add-form' onSubmit={handleAddUser }>
            <h1 className='header-user'>Add User</h1>
            <div className='form-group'>
                <label htmlFor="username" className='form-label'>Username:</label>
                <input type="text" id='username' name='username' value={username || ''} onChange={(e) => { setUsername(e.target.value) }} />
            </div>
            <div className='form-group'>
                <label htmlFor="password" className='form-label'>Password:</label>
                <input type="password" id='password' name='password' value={password || ''} onChange={(e) => { setPassword(e.target.value) }} />
            </div>
            <div className='form-group'>
                <label htmlFor="role" className='form-label'>Role:</label>
                <input type="text" id='role' name='role' value={role || ''} onChange={(e) => { setRole(e.target.value) }} />
            </div>
            <button type='submit' className='add-user-button' >Save</button>
        </form>
    </div>;

}

export default AddUser