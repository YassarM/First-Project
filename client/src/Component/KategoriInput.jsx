import { useEffect, useState, useRef } from 'react';
import React from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from '../AuthContext';
import { postMotionByKategori } from '../api';

function KategoriInput({ id_kategori, title, onSubmit, id_peserta }) {
  const [items, setItems] = useState([]);
  const [selectedScores, setSelectedScores] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const itemRefs = useRef({}); // simpan ref tiap item
  const { user, loggin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const res = await postMotionByKategori(id_kategori);
      setItems(res.data);
    };
    fetchData();
  }, [id_kategori]);

  const handleScoreClick = (key, score) => {
    setSelectedScores(prev => ({ ...prev, [key]: score }));
    setValidationErrors(prev => ({ ...prev, [key]: false }));
  };
  const handleSubmit = () => {
    const errors = {};
    let firstInvalidKey = null;

    items.forEach(item => {
      const key = `${item.id}-${item.id_score}`;
      if (selectedScores[key] === undefined) {
        errors[key] = true;
        if (!firstInvalidKey) {
          firstInvalidKey = key;
        }
      }
    });

    if (firstInvalidKey) {
      setValidationErrors(errors);

      // scroll ke item yang pertama invalid
      const ref = itemRefs.current[firstInvalidKey];
      if (ref && ref.scrollIntoView) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

    // Semua valid
    if (onSubmit) {

      const payload = Object.entries(selectedScores).map(([key, nilai]) => {
        const [id, id_score] = key.split('-');
        return {
          id_data: parseInt(id),
          nilai,
          id_juri: user.id_user,
          id_peserta: id_peserta,
        };
      });
      onSubmit(payload);
    }
  };


  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const key = `${item.id}-${item.id_score}`;

          // Ref untuk scroll
          if (!itemRefs.current[key]) {
            itemRefs.current[key] = React.createRef();
          }

          return (
            <div
              key={item.id}
              ref={itemRefs.current[key]}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <label className="w-1/3 font-medium">{item.motion}</label>
                <div className="flex gap-3">
                  {item.nilai.map((score, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded min-w-10 ${selectedScores[key] === score
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      onClick={() => handleScoreClick(key, score)}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
              {validationErrors[key] && (
                <p className="text-red-500 text-sm pl-2">⚠ Harap pilih nilai sebelum lanjut</p>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 mt-10 py-2 rounded hover:bg-green-600"
      >
        Submit & Next
      </button>
    </div>
  );
}

export default KategoriInput;
