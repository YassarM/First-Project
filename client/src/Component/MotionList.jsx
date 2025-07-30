import { useEffect, useState } from 'react';
import {
  postTambahMotion,
  deleteMotion,
  postMotionByKategori,
  getScores
} from '../api';

const MotionList = ({ id_kategori }) => {
  const [motions, setMotions] = useState([]);
  const [newMotion, setNewMotion] = useState('');
  const [scoreId, setScoreId] = useState('');
  const [scores, setScores] = useState([]);

  const loadMotions = async () => {
    const res = await postMotionByKategori(id_kategori);
    setMotions(res.data);
  };

  const loadScores = async () => {
    const res = await getScores();
    setScores(res.data);
  };

  useEffect(() => {
    loadMotions();
    loadScores();
  }, [id_kategori]);

  const handleAdd = async () => {
    if (!newMotion || !scoreId) return alert("Lengkapi semua input");
    await postTambahMotion(id_kategori, newMotion, scoreId);
    setNewMotion('');
    setScoreId('');
    await loadMotions();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus motion ini?")) {
      await deleteMotion(id);
      await loadMotions();
    }
  };

  return (
    <div className="pl-4 mt-2">
      <ul className="list-disc">
        {motions.map((m) => (
          <li key={m.id_motion} className="flex justify-between items-center pr-4">
            <div>
              <span className="font-medium">{m.motion}</span> <br />
              <span className="text-sm text-gray-500">Score ID: {m.id_score}</span>
            </div>
            <button
              onClick={() => handleDelete(m.id_motion)}
              className="text-sm text-red-500"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 mt-4">
        <input
          value={newMotion}
          onChange={(e) => setNewMotion(e.target.value)}
          className="border px-2 py-1"
          placeholder="Nama motion baru"
        />
        <select
          value={scoreId}
          onChange={(e) => setScoreId(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Pilih skor</option>
          {scores.map(score => (
            <option key={score.id_score} value={score.id_score}>
              ID: {score.id_score} - [1st: {score['1st']}, 2nd: {score['2nd']}, 3th: {score['3th']}, 4th: {score['4th']}, 5th: {score['5th']}]
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Tambah
        </button>
      </div>
    </div>
  );
};

export default MotionList;
