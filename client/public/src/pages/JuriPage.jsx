import CardPeserta from '../Component/CardPeserta.jsx';
import { useEffect, useState } from 'react';

import { dataPeserta } from '../api.js'
import { useParams } from 'react-router-dom';

function JuriPage() {
    const [pesertaData, setPesertaData] = useState([]);
    const [openCardId, setOpenCardId] = useState(null);
    const { event } = useParams()

    const fetchDataPeserta = async () => {
        try {
            const response = await dataPeserta(event);
            console.log(response.data);
            setPesertaData(response.data);
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

export default JuriPage;
