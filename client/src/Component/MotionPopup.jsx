import React, { useEffect, useState } from 'react';
import { postMotionByKategori, postTambahMotion } from '../api';

const MotionPopup = ({ idKategori, onClose, namaKategori }) => {
  const [motions, setMotions] = useState([]);
  const [message, setMessage] = useState('');
  const fecthMotion = async () => postMotionByKategori({ data: idKategori })
    .then(res => setMotions(res.data))
    .catch(err => {
      console.error('Gagal ambil data motion:', err);
      alert('Gagal ambil data motion');
    });

  useEffect(() => {
    if (idKategori) {
      fecthMotion()
    }

  }, [idKategori]);

  const handleChange = (index, field, value) => {
    const updated = [...motions];
    if (field === 'label') updated[index].motion = value;
    else updated[index].nilai[field] = value;
    setMotions(updated);
  };

  const handleAdd = () => {
    setMotions([
      ...motions,
      {
        id: null,
        id_score: null,
        motion: '',
        id_kategori: idKategori,
        nilai: ['', '', '', '', ''],
      },
    ]);
  };

  const handleDelete = (index) => {
    const updated = [...motions];
    updated.splice(index, 1);
    setMotions(updated);
  };

  const handleSave = async () => {
    try {
      const formatted = motions.map((m) => ({
        id: m.id,
        id_score: m.id_score,
        label: m.motion,
        nilai: m.nilai,
        id_kategori: m.id_kategori,
      }));
      console.log('Saving motions:', formatted);
      await postTambahMotion(formatted)
      fecthMotion();
      setMessage('Data berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal simpan data');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl relative">
        <h2 className="text-xl font-bold mb-4">Motion untuk {namaKategori}</h2>

        {message && (
          <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded">
            {message}
          </div>
        )}

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {motions.length === 0 ?<p>No Motion</p>:(motions.map((motion, index) => (
            <div key={index} className="border p-4 rounded bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <label className="w-20">Motion:</label>
                <input
                  value={motion.motion}
                  onChange={(e) => handleChange(index, 'label', e.target.value)}
                  className="flex-1 border p-1 rounded"
                />
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {motion.nilai.map((n, i) => (
                  <input
                    key={i}
                    type="number"
                    value={n}
                    onChange={(e) => handleChange(index, i, e.target.value)}
                    className="border p-1 rounded text-center"
                    placeholder={`Nilai ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )))}

        </div>

        <div className="flex justify-between items-center mt-4">
          <button onClick={handleAdd} className="bg-blue-500 text-white px-3 py-1 rounded">
            + Tambah Motion
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="bg-gray-300 px-4 py-1 rounded">
              Tutup
            </button>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-1 rounded">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionPopup;
