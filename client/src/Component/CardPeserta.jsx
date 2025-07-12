
import { useState } from 'react';
function CardPeserta({ peserta, isOpen, onToggle, onSelectNilai }) {
    const [selectedScore, setSelectedScore] = useState(null);
    const handleScoreClick = (score) => {
        setSelectedScore(score); // highlight button
        onSelectNilai(peserta.id_peserta, score); // optional: pass to parent
    };


    return (
        <div className={` flex-shrink-0 rounded-xl border shadow-md overflow-hidden transition-all duration-300 ease-in-out 
    ${isOpen ? "bg-white" : "border-none shadow-none"}
  `}>
            <div
                className="cursor-pointer p-4  flex items-center gap-4 bg-gradient-to-r from-violet-500 to-indigo-600 text-white"
                onClick={onToggle}
            >
                <img src={peserta.logo} alt="logo" className="w-10 h-10 rounded-full bg-white p-1" />
                <div>
                    <h3 className="text-lg font-bold">{peserta.nama_peserta}</h3>
                    <p className="text-sm">Tap untuk nilai</p>
                </div>
            </div>


            <div className={`p-4 ` + (isOpen ? "block" : "hidden")}>
                <p className="mb-2 text-sm text-gray-700"><strong>{peserta.sekolah}</strong>
                </p>
                <div className="grid grid-cols-7 gap-2 ">
                    {[90, 80, 70, 60, 50, 40, 0].map((score) => (
                        <button
                            key={score}
                            onClick={() => handleScoreClick(score)}
                            className={`py-2 rounded font-semibold shadow-[0_3px_20px_rgba(0,1,1,0.25)] ${selectedScore === score
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                }`}
                        >
                            {/* "bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-semibold shadow-[0_3px_20px_rgba(0,1,1,0.25)]" */}
                            {score}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default CardPeserta;
