import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function MotionPopup({ motion, onClose, onSave, id_kategori }) {
  const [localMotion, setLocalMotion] = useState(motion || []);

  const scoreFields = [
    { key: "nilai_1", label: "1st" },
    { key: "nilai_2", label: "2nd" },
    { key: "nilai_3", label: "3th" },
    { key: "nilai_4", label: "4th" },
    { key: "nilai_5", label: "5th" },
  ];

  // edit motion / skor
  const handleChange = (index, field, value) => {
    const updated = [...localMotion];
    updated[index] = { ...updated[index], [field]: value };
    setLocalMotion(updated);
  };

  // hapus motion
  const handleRemove = (index) => {
    const updated = localMotion.filter((_, i) => i !== index);
    setLocalMotion(updated);
  };

  // tambah motion baru
  const handleAdd = () => {
    const idKategori = localMotion[0].id_kategori
    console.log('localMotion:',localMotion)
    const newMotion = {
      id: Date.now(), // sementara unique id lokal
      motion: "",
      nilai_1: "",
      nilai_2: "",
      nilai_3: "",
      nilai_4: "",
      nilai_5: "",
      id_kategori: idKategori
    };
    setLocalMotion([...localMotion, newMotion]);
  };

  const handleSave = () => {
    const payload = localMotion.map(item => ({
      motion: item.motion,
      nilai: [
        Number(item.nilai_1) || 0,
        Number(item.nilai_2) || 0,
        Number(item.nilai_3) || 0,
        Number(item.nilai_4) || 0,
        Number(item.nilai_5) || 0
      ],
      id_kategori: item.id_kategori
    }));

    onSave(payload);
    onClose();
  };


  if (!motion) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-2xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <h2 className="text-white text-lg font-semibold text-center mb-4">
          Motion Control
        </h2>

        {/* Daftar Motion */}
        <div className="space-y-4 mb-6">
          {localMotion.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-3 shadow flex flex-col gap-2"
            >
              {/* Header Motion + Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(index)}
                  className="cursor-pointer bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>

                <input
                  type="text"
                  value={item.motion}
                  onChange={(e) =>
                    handleChange(index, "motion", e.target.value)
                  }
                  className="flex-1 px-2 py-1 border rounded text-black"
                  placeholder="Nama Motion"
                />
              </div>

              {/* Input skor */}
              <div className="grid grid-cols-5 gap-2">
                {scoreFields.map((sf) => (
                  <input
                    key={sf.key}
                    type="number"
                    value={item[sf.key] ?? ""}
                    onChange={(e) =>
                      handleChange(index, sf.key, e.target.value)
                    }
                    min={0}
                    max={100}
                    className="w-full px-2 py-1 border rounded text-center text-black"
                    placeholder={sf.label}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tambah Motion */}
        <button
          onClick={handleAdd}
          className="cursor-pointer w-full bg-white text-black py-2 rounded-lg mb-6 flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" /> Tambah Motion
        </button>

        {/* Save / Cancel */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSave}
            className="bg-white text-orange-600 hover:bg-gray-300 font-semibold px-6 py-2 rounded-full cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white hover:bg-red-700 font-semibold px-6 py-2 rounded-full cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
