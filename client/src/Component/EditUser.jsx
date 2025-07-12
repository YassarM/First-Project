import { useParams, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserById, updateUserById } from '../api';
import '../css/EditUser.css';
function EditUser() {
    const { id } = useParams(); // this gives you the user ID from URL
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        getUserById(id)
            .then(data => {
                console.log('Fetched user data:', data);
                setUser(data); // gunakan langsung objek user
            })
            .catch(err => {
                console.error('Error fetching user:', err);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserById(id, user)
            .then(data => {
                alert(data.message || 'User updated successfully');
                navigate('/control');
            })
            .catch(err => {
                console.error('Error updating user:', err);
                alert('Failed to update user');
            });
    };

    return <div className='edit-user-page'>
        <form className='edit-form' onSubmit={handleSubmit}>
            <h1 className='header-user'>Edit User</h1>
            <div className='form-group'>
                <label htmlFor="username" className='form-label'>Username:</label>
                <input type="text" id='username' name='username' value={user.username || ''} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor="role" className='form-label'>Role:</label>
                <input type="text" id='role' name='role' value={user.role || ''} onChange={handleChange} />
            </div>
            <button type='submit' className='edit-user-button' >Save</button>
        </form>
    </div>;

}

export default EditUser