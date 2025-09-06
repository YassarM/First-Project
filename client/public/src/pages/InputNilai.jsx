import { useNavigate, useParams } from 'react-router-dom';
import KategoriInput from "../Component/KategoriInput";
import { useState, useEffect } from 'react';
import { gradedJuri, submitNilaiToServer, getKategoriByJuri, getkategoriControl } from '../api';
import { useAuth } from '../AuthContext';

function InputNilai() {
    const { id, event } = useParams();
    const [step, setStep] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [isLastStep, setIsLastStep] = useState(false);

    const [Kategori, setKategori] = useState([]);

    
    useEffect(() => {
        const fetchKategori = async () => {
            const res = await getkategoriControl(user.id_user);
            setKategori(res.data.data);
            console.log('Fetched Kategori:', res.data.data);
        }
        fetchKategori();
    }, []);

    const confirmSubmit = async () => {
        if (pendingData) {
            await submitNilaiToServer(pendingData);
            if (isLastStep) {
                console.log('last step')
                await gradedJuri(id, user.id_user);
                navigate(event+'/juri-page');
            } else {
                setStep(prev => prev + 1);
            }
        }
        setShowConfirm(false);
        setPendingData(null);
        setIsLastStep(false);
    };

    const cancelSubmit = () => {
        setShowConfirm(false);
        setPendingData(null);
        setIsLastStep(false);
    };

    const handleNext = (data) => {
        setPendingData(data);
        setIsLastStep(false);
        setShowConfirm(true);
    };

    const handleLast = (data) => {
        setPendingData(data);
        setIsLastStep(true);
        setShowConfirm(true);
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            {Kategori.length > 0 && step <= Kategori.length && (
                <KategoriInput
                    id_kategori={Kategori[step - 1].id}
                    title={Kategori[step - 1].kategori}
                    onSubmit={step === Kategori.length ? handleLast : handleNext}
                    id_peserta={Number(id)}
                />
            )}
            {showConfirm && (
                <ConfirmDialog
                    message="Yakin untuk lanjut?"
                    onConfirm={confirmSubmit}
                    onCancel={cancelSubmit}
                />
            )}
        </div>
    );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                <p className="text-lg font-medium mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Ya
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InputNilai;
