import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { getNilaiPesertaById } from "../api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PelatihPage() {
  const [peserta, setPeserta] = useState(null);
  const [nilai, setNilai] = useState({});
  const [expanded, setExpanded] = useState(null); // kontrol dropdown per kategori

  const { user } = useAuth(); // pastikan ini sesuai dengan konteks auth yang kamu gunakan

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pesertaRes = await axios.get(`${API_BASE_URL}/peserta/${user.id_user}`);
        const nilaiRes = await getNilaiPesertaById(pesertaRes.data.id_peserta);

        const grouped = {};
        nilaiRes.data.forEach(item => {
          if (!grouped[item.kategori]) {
            grouped[item.kategori] = [];
          }

          // Cegah duplikat manual jika diperlukan
          if (!grouped[item.kategori].some(m => m.label === item.motion && m.skor === item.nilai)) {
            grouped[item.kategori].push({
              label: item.motion,
              skor: item.nilai
            });
          }
        });

        setNilai(grouped);
        setPeserta(pesertaRes.data);

      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData(); // Panggil hanya sekali saat mount
  }, []); // Pastikan dependency array kosong


  const toggleDropdown = (kategori) => {
    setExpanded((prev) => (prev === kategori ? null : kategori));
  };

  if (!peserta) return <div className="p-4">Memuat data peserta...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={`${API_BASE_URL}${peserta.logo}`}
          alt="Logo"
          className="w-16 h-16 rounded-full bg-gray-200 object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{peserta.nama_peserta}</h2>
          <p className="text-gray-600">{peserta.sekolah}</p>
        </div>
      </div>

      {/* Dropdown kategori */}
      {Object.entries(nilai).map(([kategori, items]) => (
        <div key={kategori} className="mb-4 border rounded-lg">
          <button
            className="w-full flex justify-between items-center p-4 font-semibold text-left bg-indigo-100 hover:bg-indigo-200 rounded-t"
            onClick={() => toggleDropdown(kategori)}
          >
            {kategori}
            <span>{expanded === kategori ? "▲" : "▼"}</span>
          </button>

          {expanded === kategori && (
            <div className="bg-white border-t">
              {Array.isArray(items) ? (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between px-6 py-2 border-b text-sm text-gray-700"
                  >
                    <span>{item.label}</span>
                    <span>{item.skor}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-red-500">Data tidak valid</div>
              )}
            </div>
          )}
        </div>
      ))}

    </div>
  );
}

export default PelatihPage;
