import React, { useState } from "react";
import { updateMotion, deleteMotion } from "../api";

export default function MotionCard({ motion, refreshMotion }) {
  const [editMode, setEditMode] = useState(false);
  const [newMotion, setNewMotion] = useState(motion.motion);

  const simpan = async () => {
    await updateMotion(motion.id_motion, {
      motion: newMotion,
      id_kategori: motion.id_kategori,
      id_score: motion.id_score,
    });
    setEditMode(false);
    refreshMotion();
  };

  const hapus = async () => {
    if (confirm(`Hapus motion "${motion.motion}"?`)) {
      await deleteMotion(motion.id_motion);
      refreshMotion();
    }
  };

  return (
    <div className="border p-4 rounded shadow-md">
      {editMode ? (
        <input
          value={newMotion}
          onChange={(e) => setNewMotion(e.target.value)}
          className="border p-2 rounded w-full"
        />
      ) : (
        <h3 className="font-semibold">{motion.motion}</h3>
      )}

      <p className="text-sm text-gray-600">Kategori: {motion.kategori?.nama_kategori}</p>
      <p className="text-sm text-gray-600">Skor 1st: {motion.score?.["1st"] ?? "-"}</p>

      <div className="flex gap-2 mt-2">
        {editMode ? (
          <>
            <button onClick={simpan} className="bg-blue-500 text-white px-3 py-1 rounded">Simpan</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Batal</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditMode(true)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            <button onClick={hapus} className="bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
          </>
        )}
      </div>
    </div>
  );
}
