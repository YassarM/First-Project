import { useState, useContext, useEffect } from "react";
import { EventContext, JuriIdContext } from '../pages/Panitia'
import { Minus, ArrowDown, ArrowUp, Plus } from "lucide-react";
import { getKategori, getkategoriControl, KategoriControl, removeKategoriControl } from "../api";

export default function KategoriControls({ show, onClose, onSave }) {
  const [kategori, setKategori] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const namaEvent = useContext(EventContext);
  const juri_id = useContext(JuriIdContext);

  useEffect(() => {
    if (show) {
      fetchKategori();
    }
  }, [show]);

  const fetchKategori = async () => {
    const kategoriControl = await getkategoriControl(juri_id);
    let payload = kategoriControl.data.data
    console.log(payload)
    console.log('success', kategoriControl.data.success)
    if (kategoriControl.data.success) {
      setKategori(payload)
    } else {
      const res = await getKategori(namaEvent)
      const withPrioritas = res.data.map((item, index) => ({
        ...item,
        prioritas: index + 1,
      }));
      payload = withPrioritas
      setKategori(withPrioritas);
    }

    // langsung simpan ke backend kalau sudah ada juri & asisten
    if (juri_id) {
      await KategoriControl(juri_id, payload);
    }
  };

  const updatePrioritasAndSave = async (newList) => {
    // assign ulang prioritas
    const rePrioritas = newList.map((item, index) => ({
      ...item,
      prioritas: index + 1,
    }));
    setKategori(rePrioritas);

    if (juri_id) {
      await KategoriControl(juri_id, rePrioritas);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newList = [...kategori];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    updatePrioritasAndSave(newList);
  };

  const moveDown = (index) => {
    if (index === kategori.length - 1) return;
    const newList = [...kategori];
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    updatePrioritasAndSave(newList);
  };

  const removeKategori = async (id) => {
    console.log(id)
    const success = await removeKategoriControl(id);
    console.log(success.data.success)
    if (success.data.success) {
      const newList = kategori.filter((item) => item.id !== id);
      updatePrioritasAndSave(newList);
    }
  };
  const addKategori = () => {
    setShowAddPopup(true);
  };


  const handleSave = () => {
    onSave(kategori);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-2xl shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <h2 className="text-white text-lg font-semibold text-center mb-4">
          Kategori Control
        </h2>

        {showAddPopup && (
          <AddKategoriPopup
            show={showAddPopup}
            onClose={() => setShowAddPopup(false)}
            namaEvent={namaEvent}
            existingKategori={kategori} // ⬅️ kasih kategori yang sudah ada
            onSubmit={async (chosenWithPrioritas) => {
              setKategori(chosenWithPrioritas);

              if (juri_id) {
                await KategoriControl(juri_id, chosenWithPrioritas);
              }
            }}
          />
        )}


        {/* List Kategori */}
        <div className="space-y-3 mb-6">
          {kategori.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white rounded-lg px-3 py-2"
            >
              {/* Tombol hapus */}
              <button
                onClick={() => removeKategori(item.id)}
                className="cursor-pointer bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2"
              >
                <Minus size={16} />
              </button>

              {/* Input kategori */}
              <span className="flex-1 px-2 text-black cursor-auto">
                {item.kategori}
              </span>

              {/* Tombol naik/turun */}
              <div className="flex space-x-1">
                <button
                  onClick={() => moveDown(index)}
                  className="bg-orange-500 p-1 rounded-full text-white cursor-pointer"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => moveUp(index)}
                  className="bg-orange-500 p-1 rounded-full text-white cursor-pointer"
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tambah kategori */}
        <button
          onClick={addKategori}
          className="cursor-pointer w-full bg-white text-black py-2 rounded-lg mb-6 flex items-center justify-center"
        >
          <Plus size={20} />
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


function AddKategoriPopup({ show, onClose, onSubmit, namaEvent, existingKategori }) {
  const [kategoriList, setKategoriList] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await getKategori(namaEvent);
      const allKategori = res.data;

      // ambil ID kategori yang sudah ada di kategoriControl
      const existingIds = existingKategori.map((k) => k.id);

      setKategoriList(allKategori);
      setSelected(existingIds); // auto checklist
    } catch (err) {
      console.error("❌ Gagal fetch kategori:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleSubmit = () => {
    // ambil list kategori yang dipilih
    const chosen = kategoriList.filter((k) => selected.includes(k.id));

    // kasih prioritas otomatis
    const withPrioritas = chosen.map((item, index) => ({
      ...item,
      prioritas: index + 1,
    }));

    onSubmit(withPrioritas);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg text-black font-semibold mb-4">Pilih Kategori</h2>

        <div className="space-y-2 mb-6">
          {kategoriList.map((item) => (
            <label key={item.id} className="flex items-center space-x-2 text-black">
              <input
                type="checkbox"
                checked={selected.includes(item.id)} // sudah ada → checked
                onChange={() => toggleSelect(item.id)}
              />
              <span>{item.kategori}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSubmit}
            className="bg-orange-600 text-white px-4 py-1 rounded-lg"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-1 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


