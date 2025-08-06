import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import InputPeserta from '../Component/InputPeserta';
import {
    getAllUsers,
    deleteUserById,
    getKategori
} from '../api';
import KategoriSection from "../Component/KategoriSection";

function Admin() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [kategoriList, setKategoriList] = useState([]);

    useEffect(() => {
        fetchKategori();
    }, []);

    const fetchKategori = async () => {
        const res = await getKategori();
        setKategoriList(res.data);
    };

    const usersPerPage = 15;

    useEffect(() => {
        getAllUsers().then(res => setUsers(res.data));
    }, []);

    useEffect(() => {
        if (selectedRole) {
            setFilteredUsers(users.filter(user => user.role === selectedRole));
        } else {
            setFilteredUsers(users);
        }
        setCurrentPage(1);
    }, [selectedRole, users]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await deleteUserById(id);
            setUsers(users.filter(user => user.id_user !== id));
        }
    };



    const indexOfLastUser = currentPage * usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfLastUser - usersPerPage, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members</h1>
                <Link to="/addUser">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                        + Add New
                    </button>
                </Link>
            </div>

            <div className="flex justify-between mb-4">
                <div className="text-gray-800">Total: {users.length}</div>
                <select
                    onChange={(e) => setSelectedRole(e.target.value)}
                    value={selectedRole}
                    className="border px-2 py-1"
                >
                    <option value=''>All Roles</option>
                    {[...new Set(users.map(u => u.role))].map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
            <table className="min-w-full border bg-white text-center">
                <thead className="bg-gray-100">
                    <tr className="align-middle">
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Role</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.id_user} className="border border-gray-500 align-middle">
                            <td className="py-2 px-4">{user.username}</td>
                            <td className="py-2 px-4">{user.role}</td>
                            <td className="py-2 px-4">{user.status}</td>
                            <td className="py-2 px-4">{new Date(user.date).toLocaleString()}</td>
                            <td className="py-2 px-4">
                                <Link to={`/editUser/${user.id_user}`} className="text-blue-500 text-lg">✏️</Link>
                                <button onClick={() => handleDelete(user.id_user)} className="text-red-500 text-lg ml-2">🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            <KategoriSection kategoriList={kategoriList} refreshKategori={fetchKategori} />

            {/* Input peserta */}
            <InputPeserta />
        </div>
    );
}

export default Admin;
