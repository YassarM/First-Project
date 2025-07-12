import { useState } from 'react';
import { Link } from 'react-router-dom';

function UserCard({ User, DeleteUser }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <div className="user-card">
            <h3>{User.username}</h3>

            <p style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Password:</strong>&nbsp;
                <span>
                    {showPassword ? User.password : '••••••••'}
                </span>
                <span
                    className="material-symbols-outlined"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                >
                    {showPassword ? 'visibility_off' : 'visibility'}
                </span>
            </p>
            <p><strong>Role:</strong> {User.role}</p>
            <div className="user-actions">
                <Link to={`/editUser/${User.id_user}`}>
                    <button className="edit-btn">Edit</button>
                </Link>
                <button className="delete-btn" onClick={() => DeleteUser(User.id_user)}>Delete</button>
            </div>
        </div>
    );
}

export default UserCard;
