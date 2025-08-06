import React, { useState } from "react";
import { updateKategori, deleteKategori } from "../api";

export default function KategoriCard({ id, nama, prioritas, refresh, onOpenMotionPopup }) {
    const [editMode, setEditMode] = useState(false);
    const [namaBaru, setNamaBaru] = useState(nama);

    const simpanPerubahan = async () => {
        if (namaBaru.trim() === "") return;
        await updateKategori(id, { nama_kategori: namaBaru, prioritas });
        setEditMode(false);
        refresh();
    };

    const hapusKategori = async () => {
        if (confirm(`Yakin hapus kategori "${nama}"?`)) {
            await deleteKategori(id);
            refresh();
        }
    };

    const naikPrioritas = async () => {
        if (prioritas <= 1) return;
        await updateKategori(id, { nama_kategori: nama, prioritas: prioritas - 1 });
        refresh();
    };

    const turunPrioritas = async () => {
        await updateKategori(id, { nama_kategori: nama, prioritas: prioritas + 1 });
        refresh();
    };

    return (
        <div className="border rounded-xl p-4 shadow hover:shadow-md transition bg-amber-50">
            {editMode ? (
                <input
                    type="text"
                    value={namaBaru}
                    onChange={(e) => setNamaBaru(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-2">{nama} {prioritas}</h3>
                </>
            )}

            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={naikPrioritas}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                    Naik ↑
                </button>
                <button
                    onClick={turunPrioritas}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                    Turun ↓
                </button>

                {editMode ? (
                    <>
                        <button
                            onClick={simpanPerubahan}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Simpan
                        </button>
                        <button
                            onClick={() => {
                                setNamaBaru(nama);
                                setEditMode(false);
                            }}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                            Batal
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={hapusKategori}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            Hapus
                        </button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800"
                            onClick={onOpenMotionPopup}>Motion</button>
                    </>
                )}


            </div>
        </div>
    );
}
