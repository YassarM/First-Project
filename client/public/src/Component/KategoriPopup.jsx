import React, { useState } from 'react';
export default function KategoriPopup ({ onClose, namaKategori, handleSubmit }) {
  const [LocalNamaKategori, setLocalNamaKategori] = useState(namaKategori);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block mb-1 text-center font-semibold">Nama Kategori</label>
          <input
            type="text"
            value={LocalNamaKategori}
            onChange={(e) => setLocalNamaKategori(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="cursor-pointer bg-gray-400 text-white px-4 py-1 rounded">
            Batal
          </button>
          <button onClick={()=>handleSubmit(LocalNamaKategori)} className="cursor-pointer bg-green-600 text-white px-4 py-1 rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};


