export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-red-500 shadow">
        <h1 className="text-4xl font-bold mb-4">Poinix</h1>
        <p className="text-lg mb-6">Cepat, Terintegrasi, Efisien, dan Modern</p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-700">Login</button>
          <button className="bg-gray-200 px-6 py-2 rounded-2xl shadow hover:bg-gray-300">Lihat Leaderboard</button>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-16 px-4">
        <h2 className="text-2xl font-semibold text-center mb-10">Keunggulan Sistem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Cepat", desc: "Akses dan input nilai secara real-time." },
            { title: "Terintegrasi", desc: "Seluruh data peserta, juri, dan nilai terkoneksi dalam satu sistem." },
            { title: "Efisien", desc: "Alur kerja yang minim klik dan jelas." },
            { title: "Modern", desc: "Desain yang responsif dan bersih untuk semua perangkat." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow text-center border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alur Sistem */}
      <section className="py-16 bg-white px-4">
        <h2 className="text-2xl font-semibold text-center mb-10">Cara Kerja Sistem</h2>
        <ol className="max-w-3xl mx-auto space-y-4 text-lg list-decimal list-inside">
          <li>Juri login ke sistem untuk input nilai peserta</li>
          <li>Sistem otomatis rekap seluruh nilai</li>
          <li>Leaderboard dan rekap nilai ter-update real-time</li>
          <li>Panitia dan pelatih dapat memantau hasil kapan saja</li>
        </ol>
      </section>

      {/* Akses Cepat */}
      <section className="py-12 px-4">
        <h2 className="text-2xl font-semibold text-center mb-8">Akses Cepat</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            "Login sebagai Juri",
            "Lihat Leaderboard",
            "Registrasi Peserta",
            "Dashboard Admin",
          ].map((label, idx) => (
            <button
              key={idx}
              className="bg-blue-500 text-white px-5 py-3 rounded-2xl shadow hover:bg-blue-600"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        &copy; 2025 Sistem Penilaian Lomba. Dibuat oleh Tim Developer.
      </footer>
    </div>
  );
}
