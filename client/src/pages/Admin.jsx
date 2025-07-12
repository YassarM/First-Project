
import '../css/Admin.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserCard from '../Component/UserCard';
function Admin() {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/users", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:5000/user/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    alert("User deleted successfully.");
                    // Refresh users list after delete
                    await fetchUsers(); // Ambil ulang dari database
                } else {
                    alert("Failed to delete user.");
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert("Error deleting user.");
            }
        }
    };

    return (
        <>
            <div className='admin-container'>
    <div className='admin-header'>
        <h1 className='header-admin'>Users</h1>
        <Link to="/addUser">
            <button className='add-user-button'>+ Add User</button>
        </Link>
    </div>

    <div className="admin-page">
        {users.length === 0 ? (
            <p>No users found.</p>
        ) : (
            users.map(user => (
                <UserCard key={user.id_user} User={user} DeleteUser={handleDelete} />
            ))
        )}
    </div>
</div>

        </>
    );
}

export default Admin;