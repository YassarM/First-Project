import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { statusPeserta, ungradedStatus, getJuriByAsjur, inputNotesAsjur } from '../api';

function CardPeserta({ peserta }) {
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();
  const { user } = useAuth(); // must include role
  const role = user?.role;
  const [showNote, setShowNote] = useState(false);
  const [asjur, setAsjur] = useState([]);
  const [note, setNote] = useState('');
  const { event } = useParams()
  useEffect(() => {
    const fetchStatus = async () => {
      let idJuri = user.id_user;
      if (role === 'Asjur') {
        const res = await getJuriByAsjur();
        setAsjur(res.data);
        idJuri = res.data[0].id_juri; // ambil id juri dari asjur
      }
      const data = await statusPeserta(peserta.id_peserta, idJuri);
      setStatus(data.data.status); // 'ungraded', 'graded', 'noted', 'locked'
    };
    fetchStatus();
  }, [peserta.id_peserta]);

  const submitNote = async () => {
    try {
      const res = await inputNotesAsjur(peserta.id_peserta, note, user.id_user);

      if (res.data) alert('Catatan berhasil disimpan!');
      setShowNote(false);
      setStatus('Locked')
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan catatan');
    }
  };


  const handleClick = () => {
    if (role === 'Juri' && status === 'Ungraded') {
      navigate(`/${event}/grade/${peserta.id_peserta}`);
    } else if (role === 'Asjur' && status === 'Graded') {
      setShowNote(prev => !prev);
    }
  };

  const getStatusText = (id) => {
    switch (status) {
      case 'Ungraded': return role === 'Juri' ? 'Tap untuk nilai' :' Belum Dinilai';
      case 'Graded': return role === 'Asjur' ? 'Tap untuk beri catatan' : 'Sudah Dinilai ✅';
      case 'Locked': return '✅ Terkunci';
      default: {
        if (role === 'Juri') ungradedStatus(id, user.id_user);
        return 'Memuat status...'
      }
    }
  };

  return (
    <div className={`rounded-xl border shadow-md `}>

      <div
        className={`cursor-pointer p-4 flex items-center gap-4  text-white 
        ${status === 'Locked' ? 'pointer-events-none bg-gradient-to-r from-red-500 to-indigo-600' : 'bg-gradient-to-r from-violet-500 to-indigo-600'}`}
        onClick={handleClick}
      >
        <img
          src={
            peserta.logo?.startsWith('http')
              ? peserta.logo
              : `${import.meta.env.VITE_API_BASE_URL}${peserta.logo}`
          }
          alt="logo"
          className="w-10 h-10 rounded-full bg-white p-1"
        />
        <div>
          <h3 className="text-lg font-bold">{peserta.nama_peserta}</h3>
          <p className="text-sm no-underline">{getStatusText(peserta.id_peserta)}</p>
        </div>
      </div>
      <div className={`p-4 bg-gray-300 ${showNote ? '' : 'hidden'}`}>
        <textarea
          name="note"
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tulis catatan di sini..."
          className="w-full h-24 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm text-gray-700"
        ></textarea>
        <button
          onClick={submitNote}
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Simpan Catatan
        </button>
      </div>
    </div>
  );
}

export default CardPeserta;
