import React, { useState } from 'react';
import { postTambahKategori } from '../api';

const TambahKategoriPopup = ({ onClose, onSuccess, prioritasDef }) => {
  const [namaKategori, setNamaKategori] = useState('');
  const [prioritas, setPrioritas] = useState(prioritasDef || 0);

  const handleSubmit = async () => {
    if (!namaKategori ) {
      alert('Semua kolom harus diisi');
      return;
    }

    try {
      await postTambahKategori({
        nama_kategori: namaKategori,
        prioritas: parseInt(prioritas),
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Gagal tambah kategori');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambah Kategori</h2>

        <div className="mb-4">
          <label className="block mb-1">Nama Kategori</label>
          <input
            type="text"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-1 rounded">
            Batal
          </button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-1 rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahKategoriPopup;
