import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function InputPBB() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/pbb-murni`, { withCredentials: true })
      .then((res) => {
        const transformed = res.data.map((item) => ({
          id: item.id,
          id_score: item.id_score,
          gerakan: item.gerakan,
          nilai: item.nilai,
        }));
        setData(transformed);
      })
      .catch((err) => console.error("Error fetch data:", err));
  }, []);


  const handleGerakanChange = (index, value) => {
    const updated = [...data];
    updated[index].gerakan = value;
    setData(updated);
  };

  const handleNilaiChange = (rowIndex, nilaiIndex, value) => {
    const updated = [...data];
    updated[rowIndex].nilai[nilaiIndex] = parseInt(value) || 0 || '';
    setData(updated);
  };

  const handleAddRow = () => {
    setData([...data, { gerakan: "", nilai: [0, 0, 0, 0, 0] }]);
  };

  const handleDeleteRow = async (index) => {
    const row = data[index];
    if (row.id) {
      await axios.delete(`${API_BASE_URL}/pbb-murni/${row.id}`, { withCredentials: true });
    }
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/pbb-murni`, data, { withCredentials: true });
      alert("Berhasil disimpan!");
    } catch (err) {
      alert("Gagal simpan data");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Gerakan PBB Murni</h2>
      <table className="min-w-full table-auto border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">Gerakan</th>
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
                  value={row.gerakan}
                  onChange={(e) => handleGerakanChange(rowIndex, e.target.value)}
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
