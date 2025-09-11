import { useState } from "react";
import { ImagePlus } from 'lucide-react'
export default function PesertaPopup({ isOpen, onClose, onSubmit, initialData }) {
    const [namaPeserta, setNamaPeserta] = useState(initialData?.peserta || "");
    const [namaPelatih, setNamaPelatih] = useState(initialData?.pelatih || "");
    const [idPelatih,setIdPelatih] = useState(initialData?.id_pelatih || null)
    const [idPeserta,setIdPeserta] = useState(initialData?.id_peserta || null)
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(initialData?.logo || null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            nama_peserta: namaPeserta,
            nama_pelatih: namaPelatih,
            id_pelatih: idPelatih,
            id_peserta: idPeserta,
        };
        onSubmit(data, logo); // kirim nama peserta dulu + simpan logo untuk nanti
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl p-6 w-96 relative">

                {/* Foto / Logo */}
                <label className="flex justify-center mb-4 cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {preview ? (
                            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                        ) : (
                            <ImagePlus size={36} className="text-gray-400" />
                        )}
                    </div>
                </label>

                {/* Input Nama */}
                <input
                    type="text"
                    placeholder="Nama Peserta"
                    value={namaPeserta}
                    onChange={(e) => setNamaPeserta(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg mb-6 text-center font-semibold"
                />

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleSubmit}
                        className="cursor-pointer px-6 py-2 rounded-full bg-white text-orange-500 font-bold shadow"
                    >
                        Simpan
                    </button>
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-6 py-2 rounded-full bg-red-500 text-white font-bold shadow"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
