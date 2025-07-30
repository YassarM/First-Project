import { useEffect, useState } from "react";
import axios from "axios";
import { deletePelatih, deletePeserta, getAllPelatih, getPesertaById, inputPeserta, uploadLogo } from "../api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function InputPeserta() {
    const [pelatihList, setPelatihList] = useState([]);
    const [selectedPelatih, setSelectedPelatih] = useState(null);
    const [data, setData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [showPelatihForm, setShowPelatihForm] = useState(false);
    const [newPelatih, setNewPelatih] = useState({ username: "", password: "", role: "Pelatih" });

    useEffect(() => {
        getAllPelatih().then(res => setPelatihList(res.data));
    }, []);

    const fetchPesertaByPelatih = async (id) => {
        const res = await getPesertaById(id);
        setData(res.data);
        setValidationErrors({});
    };

    const handleChange = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = value;
        setData(newData);

        const newErrors = { ...validationErrors };
        if (value.trim()) {
            if (newErrors[index]) {
                delete newErrors[index][field];
                if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
            }
        } else {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index][field] = true;
        }
        setValidationErrors(newErrors);
    };

    const handleAddRow = () => {
        if (!selectedPelatih) return alert("Pilih pelatih terlebih dahulu");
        setData([...data, { id_peserta: null, nama_peserta: "", sekolah: "", logo: "", id_pelatih: selectedPelatih }]);
    };

    const handleDeleteRow = (index) => {
        if (data[index].id_peserta) {
            deletePeserta(data[index].id_peserta)
                .then((res) => {
                    alert(res.data.message);
                    const newData = data.filter((_, i) => i !== index);
                    setData(newData);
                })
                .catch(err => console.error("Error deleting peserta:", err));
            return;
        } else {
            const newData = data.filter((_, i) => i !== index);
            setData(newData);
        }
    };

    const handleSubmit = async () => {
        if (data.length === 0) return alert("Tidak ada peserta untuk disimpan");

        const newErrors = {};
        data.forEach((row, i) => {
            const errors = {};
            if (!row.nama_peserta?.trim()) errors.nama_peserta = true;
            if (!row.sekolah?.trim()) errors.sekolah = true;
            if (!row.logo?.trim()) errors.logo = true;
            if (Object.keys(errors).length > 0) newErrors[i] = errors;
        });

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return alert("Isi semua kolom yang wajib diisi (Nama Peserta & Sekolah).");
        }

        try {
            const res = await inputPeserta(data);
            alert("Peserta berhasil disimpan");
            fetchPesertaByPelatih(selectedPelatih);
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan");
        }
    };

    return (
        <div className="p-4 min-h-screen ">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-4">Input Peserta</h2>
                <button
                    onClick={() => setShowPelatihForm(true)}
                    className="bg-purple-600 text-white px-3 py-1 rounded mb-3"
                >
                    + Tambah Pelatih
                </button>
                <div className="flex items-center gap-2 mb-4">
                    <select
                        onChange={(e) => {
                            const id = parseInt(e.target.value);
                            setSelectedPelatih(id);
                            fetchPesertaByPelatih(id);
                        }}
                        className="border p-2"
                        value={selectedPelatih || ""}
                    >
                        <option value="">Pilih Pelatih</option>
                        {pelatihList.map(p => (
                            <option key={p.id_user} value={p.id_user}>{p.username}</option>
                        ))}
                    </select>
                    <button
                        onClick={async () => {
                            const selectedName = pelatihList.find(p => p.id_user === selectedPelatih)?.username;
                            const confirmDelete = confirm(`Yakin ingin menghapus pelatih ${selectedName}?`);
                            if (!confirmDelete) return;

                            try {
                                await deletePelatih(selectedPelatih);
                                const res = await getAllPelatih();
                                setPelatihList(res.data);
                                setSelectedPelatih(null);
                                setData([]);
                                alert("Pelatih berhasil dihapus!");
                            } catch (err) {
                                console.error(err);
                                alert("Gagal menghapus pelatih");
                            }
                        }}
                        className="bg-red-500 hover:bg-amber-700 text-gray-800 hover:text-red-800 cursor-pointer text-3xl py-1 rounded px-3 ml-5 mr-5"
                        title="Hapus pelatih yang dipilih"
                    >
                        🗑
                    </button>
                    <button onClick={handleAddRow} className="bg-blue-500 text-white px-3 py-1 rounded mb-2">+ Tambah Peserta</button>
                </div>

                {selectedPelatih && data.length > 0 && (
                    <>
                        <table className="min-w-full table-auto border border-collapse">
                            <thead>
                                <tr className="bg-gray-400">
                                    <th className="border px-3 py-2">Nama Peserta</th>
                                    <th className="border px-3 py-2">Sekolah</th>
                                    <th className="border px-3 py-2">Logo</th>
                                    <th className="border px-3 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className="bg-gray-500">
                                        <td className="border px-3 py-2">
                                            <input
                                                type="text"
                                                value={row.nama_peserta || ""}
                                                onChange={(e) => handleChange(index, 'nama_peserta', e.target.value)}
                                                className="w-full border p-1"
                                            />
                                            {validationErrors[index]?.nama_peserta && (
                                                <p className="text-red-600 text-sm mt-1">Nama peserta wajib diisi</p>
                                            )}
                                        </td>
                                        <td className="border px-3 py-2">
                                            <input
                                                type="text"
                                                value={row.sekolah || ""}
                                                onChange={(e) => handleChange(index, 'sekolah', e.target.value)}
                                                className="w-full border p-1"
                                            />
                                            {validationErrors[index]?.sekolah && (
                                                <p className="text-red-600 text-sm mt-1">Sekolah wajib diisi</p>
                                            )}
                                        </td>
                                        <td className="border px-3 py-2">
                                            <label className="cursor-pointer bg-white border rounded p-1 inline-block">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        const formData = new FormData();
                                                        formData.append("logo", file);

                                                        try {
                                                            const res = await uploadLogo(formData);
                                                            const newData = [...data];
                                                            newData[index].logo = res.filePath;
                                                            console.log(res.filePath)
                                                            setData(newData);
                                                            alert("Logo berhasil diunggah!");
                                                        } catch (err) {
                                                            console.error("Upload error", err);
                                                            alert("Gagal upload logo");
                                                        }
                                                    }}
                                                />
                                                Pilih Logo
                                            </label>
                                            {validationErrors[index]?.logo && (
                                                <p className="text-red-600 text-sm mt-1">Logo wajib diunggah</p>
                                            )}

                                            {row.logo && <img src={`${API_BASE_URL}${row.logo}`} className="w-10 h-10 mt-2 object-contain" />}
                                        </td>
                                        <td className="border px-3 py-2 text-center">
                                            <button onClick={() => handleDeleteRow(index)} className="text-red-600">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Simpan</button>
                    </>
                )}
            </div>

            {showPelatihForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h3 className="text-lg font-bold mb-4">Tambah Pelatih</h3>
                        <input
                            type="text"
                            placeholder="Username"
                            value={newPelatih.username}
                            onChange={(e) => setNewPelatih({ ...newPelatih, username: e.target.value })}
                            className="w-full border p-2 mb-3"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newPelatih.password}
                            onChange={(e) => setNewPelatih({ ...newPelatih, password: e.target.value })}
                            className="w-full border p-2 mb-3"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowPelatihForm(false)}
                                className="px-3 py-1 bg-gray-400 text-white rounded"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    if (!newPelatih.username || !newPelatih.password) return alert("Lengkapi semua data!");
                                    try {
                                        await axios.post(`${API_BASE_URL}/register`, {
                                            ...newPelatih,
                                            role: "Pelatih"
                                        });
                                        const res = await axios.get(`${API_BASE_URL}/all-pelatih`);
                                        setPelatihList(res.data);
                                        alert("Pelatih berhasil ditambahkan!");
                                        setShowPelatihForm(false);
                                        setNewPelatih({ username: "", password: "" });
                                    } catch (err) {
                                        console.error(err);
                                        alert("Gagal menambahkan pelatih");
                                    }
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
