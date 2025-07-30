import { useEffect, useState } from 'react';
import { deleteMotion, postTambahMotion, postMotionByKategori } from '../api';

export default function EditableTable({ endpoint, title, id_kategori, nama }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        postMotionByKategori(id_kategori)
            .then((res) => {
                const transformed = res.data.map((item) => ({
                    id: item.id,
                    id_score: item.id_score,
                    label: item.motion,
                    nilai: item.nilai,
                }));
                setData(transformed);
                console.log("Raw data from backend:", res.data);
                console.log("Data:", transformed);
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [endpoint]);

    const handleLabelChange = (index, value) => {
        const updated = [...data];
        updated[index].label = value;
        setData(updated);
    };

    const handleNilaiChange = (rowIndex, nilaiIndex, value) => {
        const updated = [...data];
        updated[rowIndex].nilai[nilaiIndex] = parseInt(value) || 0 || '';
        setData(updated);
    };

    const handleAddRow = () => {
        setData([...data, { label: "", nilai: [0, 0, 0, 0, 0] }]);
    };

    const handleDeleteRow = async (index) => {
        const row = data[index];
        if (row.id) {
            deleteMotion(row.id)
        }
        const updated = data.filter((_, i) => i !== index);
        setData(updated);
    };

    const handleSubmit = async () => {
        try {
            const payload = data.map(row => ({
                id: row.id,
                id_score: row.id_score,
                label: row.label,
                nilai: row.nilai,
                id_kategori: id_kategori,
            }));
            console.log("Final payload:", payload);

            postInputMotion(payload)

            alert("Data berhasil disimpan!");
        } catch (err) {
            alert("Gagal menyimpan data");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
            <table className="min-w-full table-auto border border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-3 py-2">{nama}</th>
                        {[...Array(5)].map((_, i) => (
                            <th key={i} className="border px-3 py-2">Nilai {i + 1}</th>
                        ))}
                        <th className="border px-3 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="border px-3 py-2">
                                <input
                                    type="text"
                                    value={row.label}
                                    onChange={(e) => handleLabelChange(rowIndex, e.target.value)}
                                    className="w-full p-1 border rounded"
                                    required
                                />
                            </td>
                            {row.nilai.map((nilai, nilaiIndex) => (
                                <td key={nilaiIndex} className="border px-3 py-2">
                                    <input
                                        type="number"
                                        value={nilai}
                                        onChange={(e) => handleNilaiChange(rowIndex, nilaiIndex, e.target.value)}
                                        className="w-full p-1 border rounded"
                                        min={0}
                                        max={100}
                                        required
                                    />
                                </td>
                            ))}
                            <td className="border px-3 py-2 text-center">
                                <button onClick={() => handleDeleteRow(rowIndex)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex gap-4">
                <button onClick={handleAddRow} className="bg-green-600 text-white px-4 py-2 rounded">
                    + Tambah Baris
                </button>
                <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                    💾 Simpan Semua
                </button>
            </div>
        </div>
    );
}
