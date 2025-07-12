import CardPeserta from '../Component/CardPeserta';
import { useEffect, useState } from 'react';

function AddRekapNilai() {
  const [pesertaData, setPesertaData] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);

  const fetchDataPeserta = async () => {
    try {
      const response = await fetch("http://localhost:5000/peserta", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch peserta data");

      const data = await response.json();
      setPesertaData(data);
    } catch (error) {
      console.error("Error fetching peserta data:", error);
    }
  };

  useEffect(() => {
    fetchDataPeserta();
  }, []);

  const handleSelectNilai = (id, nilai) => {
    console.log(`Peserta ${id} diberi nilai ${nilai}`);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col gap-4 p-4 w-[80%] mx-auto">
        {pesertaData.map((peserta) => (
          <CardPeserta
            key={peserta.id_peserta}
            peserta={peserta}
            isOpen={openCardId === peserta.id_peserta}
            onToggle={() =>
              setOpenCardId((prevId) => (prevId === peserta.id_peserta ? null : peserta.id_peserta))
            }
            onSelectNilai={handleSelectNilai}
          />
        ))}
      </div>
    </div>
  );
}

export default AddRekapNilai;
