import React, { useEffect, useState } from 'react';
import KategoriCard from './KategoriCard';
import KategoriPopup from './KategoriPopup';
import MotionPopup from './MotionPopup';
import { getKategori } from '../api';

const KategoriSection = () => {
    const [kategori, setKategori] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [maxPrioritas, setMaxPrioritas] = useState(0);

    const [showMotionPopup, setShowMotionPopup] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState(null);
    const fetchKategori = async () => {
        try {
            const res = await getKategori();
            setKategori(res.data);
            const temp = Math.max(...kategori.map(k => k.prioritas));
            setMaxPrioritas(temp + 1);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchKategori();
    }, []);

    const handleAdded = () => {
        setShowForm(false);
        fetchKategori();
    };
    const handleOpenMotionPopup = (kategori) => {
        setSelectedKategori(kategori);
        setShowMotionPopup(true);
    };

    const handleCloseMotionPopup = () => {
        setShowMotionPopup(false);
        setSelectedKategori(null);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Kategori Penilaian</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                >
                    + Tambah Kategori
                </button>
            </div>

            {showForm && (
                <KategoriPopup onClose={() => setShowForm(false)} onSuccess={handleAdded} prioritasDef={maxPrioritas} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kategori.map((item) => (
                    <KategoriCard
                        key={item.id_kategori}
                        id={item.id_kategori}
                        nama={item.nama_kategori}
                        prioritas={item.prioritas}
                        refresh={fetchKategori} // ganti ini sesuai fungsi refresh lo
                        onOpenMotionPopup={() => handleOpenMotionPopup(item)}
                    />
                ))}
            </div>
            {showMotionPopup && selectedKategori && (
                <MotionPopup
                    idKategori={selectedKategori.id_kategori}
                    onClose={handleCloseMotionPopup}
                    namaKategori={selectedKategori.nama_kategori}
                />

            )}
        </div>
    );
};

export default KategoriSection;
