// Admin.jsx
import '../css/Admin.css';
import { useEffect, useState } from 'react';
import { data, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import InputVariasi from '../Component/InputVariasi';
import InputPeserta from '../Component/InputPeserta';
import { getAllUsers, deleteUserById, getKategori, addKategori, updateKategori, deleteKategori } from '../api';
import MotionList from '../Component/MotionList';

function Admin() {
    const { login } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [kategoriList, setKategoriList] = useState([]);
    const [newKategori, setNewKategori] = useState('');
    const [prioritas, setPrioritas] = useState(1);
    const usersPerPage = 15;


    useEffect(() => {
        getAllUsers().then(res => {
            console.log("Users fetched:", res.data);
            setUsers(res.data)
        });
        getKategori().then(res => {
            console.log("Kategori List:", res.data);
            setKategoriList(res.data);
        })
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
            deleteUserById(id).then(() => {
                setUsers(users.filter(user => user.id_user !== id));
            });
        }
    };

    const handleAddKategori = async () => {
        if (!newKategori) return;
        const data = await addKategori(newKategori, prioritas);
        if (data.data) {
            setKategoriList(prev => [...prev, data.data]);
            setNewKategori('');
            setPrioritas(1);
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
                    <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">+ Add New</button>
                </Link>
            </div>

            <div className="flex justify-between mb-4">
                <div className="text-gray-800">Total: {users.length}</div>
                <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole} className="border px-2 py-1">
                    <option value=''>All Roles</option>
                    {[...new Set(users.map(u => u.role))].map(role => <option key={role} value={role}>{role}</option>)}
                </select>
            </div>

            <table className="min-w-full border bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Role</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.id_user} className="border-t">
                            <td className="py-2 px-4">{user.username}</td>
                            <td className="py-2 px-4">{user.role}</td>
                            <td className="py-2 px-4">{user.status}</td>
                            <td className="py-2 px-4">{new Date(user.date).toLocaleString()}</td>
                            <td className="py-2 px-4">
                                <Link to={`/editUser/${user.id_user}`} className="text-blue-500">Edit</Link>
                                <button onClick={() => handleDelete(user.id_user)} className="text-red-500 ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>{i + 1}</button>
                    ))}
                </div>
            )}
            { /* Kategori Section */}
            { /* Kategori Section */}
            { /* Kategori Section */}


            <section className="mt-12">
                <h2 className="text-xl font-bold mb-4">Kategori Penilaian</h2>

                {kategoriList
                    .sort((a, b) => a.prioritas - b.prioritas)
                    .map((kategori, index) => (
                        <div
                            key={kategori.id_kategori}
                            className="border p-4 mb-4 rounded shadow bg-gray-50"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <strong>{kategori.nama_kategori}</strong>
                                <div className="flex gap-2">
                                    <button
                                        disabled={index === 0}
                                        onClick={async () => {
                                            const above = kategoriList[index - 1];
                                            await updateKategori(kategori.id_kategori, {
                                                nama_kategori: above.nama_kategori,
                                                prioritas: above.prioritas,
                                            });
                                            await updateKategori(above.id_kategori, {
                                                nama_kategori: kategori.nama_kategori,
                                                prioritas: kategori.prioritas,
                                            });
                                            getKategori().then(res => {
                                                setKategoriList(res.data)
                                            })
                                        }}
                                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        disabled={index === kategoriList.length - 1}
                                        onClick={async () => {
                                            const below = kategoriList[index + 1];
                                            await updateKategori(kategori.id_kategori, {
                                                nama_kategori: below.nama_kategori,
                                                prioritas: below.prioritas,
                                            });
                                            await updateKategori(below.id_kategori, {
                                                nama_kategori: kategori.nama_kategori,
                                                prioritas: kategori.prioritas,
                                            });
                                            getKategori().then(res => {
                                                setKategoriList(res.data)
                                            })
                                        }}
                                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const newNama = prompt(
                                                "Masukkan nama baru",
                                                kategori.nama_kategori
                                            );
                                            if (newNama) {
                                                await updateKategori(kategori.id_kategori, {
                                                    nama_kategori: newNama,
                                                    prioritas: kategori.prioritas,
                                                });
                                                getKategori().then(res => {
                                                    setKategoriList(res.data);
                                                })
                                            }
                                        }}
                                        className="px-2 py-1 bg-yellow-400 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (
                                                window.confirm(
                                                    `Hapus kategori "${kategori.nama_kategori}"?`
                                                )
                                            ) {
                                                await deleteKategori(kategori.id_kategori);
                                                getKategori().then(res => {
                                                    setKategoriList(res.data)
                                                })
                                            }
                                        }}
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Motion untuk kategori ini */}
                            <MotionList id_kategori={kategori.id_kategori} />
                        </div>
                    ))}
            </section>

            { /* Kategori Section */}
            { /* Kategori Section */}
            { /* Kategori Section */}
            <InputPeserta />
        </div>
    );
}

export default Admin;
