

const Card = ({ children, gradient }) => (
  <div className={`rounded-2xl p-6 text-white shadow-lg w-full max-w-xs`} style={{ background: gradient }}>
    {children}
  </div>
);
function RekapNilai() {
  return (
    <>
    <Card gradient="linear-gradient(to bottom, #7C3AED, #4C1D95)">
        <h2 className="text-xl font-semibold mb-3">Input Nilai - JURI2</h2>
        <select className="input mb-3">
          <option>Pilih Peserta</option>
        </select>
        <p className="font-semibold mb-2">Kategori: PBB MURNI</p>
        <div className="grid grid-cols-3 gap-2">
          {[90, 80, 70, 60, 50, 40, 0].map(score => (
            <button key={score} className="btn">{score}</button>
          ))}
        </div>
        <button className="btn mt-5 w-full">Lanjut</button>
      </Card>
    </>
  );
}

export default RekapNilai;