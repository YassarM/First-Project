import React from 'react';


const Card = ({ children, gradient }) => (
  <div className={`rounded-2xl p-6 text-white shadow-lg w-full max-w-xs`} style={{ background: gradient }}>
    {children}
  </div>
);

export default function Test() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 flex flex-wrap justify-center items-center gap-6 p-6">
      <Card gradient="linear-gradient(to bottom, #EF4444, #DC2626)">
        <h1 className="text-2xl font-bold mb-6 text-center">SISTEM PENILAIAN</h1>
        <input type="text" placeholder="Username" className="input" />
        <input type="password" placeholder="Password" className="input mt-3" />
        <button className="btn mt-5">LOGIN</button>
      </Card>

      <Card gradient="linear-gradient(to bottom, #8B5CF6, #6D28D9)">
        <h2 className="text-xl font-semibold mb-3">PANEL ADMIN</h2>
        <input type="text" placeholder="Nama Peserta" className="input mb-3" />
        <input type="text" placeholder="Username" className="input mb-3" />
        <input type="password" placeholder="Password" className="input mb-3" />
        <h3 className="font-semibold mt-5 mb-2">REKAP NILAI & RANKING</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Peserta</th>
              <th className="text-right">Total Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SMKN 7 Garut</td>
              <td className="text-right">340 (Juara 1)</td>
            </tr>
            <tr>
              <td>SMAN 7 Garut</td>
              <td className="text-right">296 (Juara 2)</td>
            </tr>
          </tbody>
        </table>
      </Card>

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

      <Card gradient="linear-gradient(to bottom, #EF4444, #DC2626)">
        <h2 className="text-xl font-bold mb-4 text-center">REKAP NILAI UNTUK SMKN 10 GARUT</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Kategori</th>
              <th className="text-right">Total Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>PBB MURNI</td><td className="text-right">250</td></tr>
            <tr><td>VARVOR</td><td className="text-right">158</td></tr>
            <tr><td>KOMANDAN</td><td className="text-right">222</td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
