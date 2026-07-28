"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight, 
  Image as ImageIcon, 
  AlignLeft, 
  Code, 
  Wand2, 
  BookOpen,
  ArrowLeft,
  Settings2
} from "lucide-react";

const DOCS_SECTIONS = [
  { id: "intro", title: "Pengantar", icon: BookOpen },
  { id: "modes", title: "Mode Analisis", icon: Settings2 },
  { id: "image", title: "Mode Gambar", icon: ImageIcon },
  { id: "banner", title: "Mode Banner", icon: AlignLeft },
  { id: "ai", title: "Analisis AI & JSON", icon: Wand2 },
  { id: "integration", title: "Integrasi Hasil", icon: Code },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("intro");

  // Handle active section tracking on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    DOCS_SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col z-10 shrink-0 h-full shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-bold text-slate-800">Kembali ke Studio</span>
          </Link>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Skets Docs</h2>
              <p className="text-xs font-medium text-slate-500">v1.0.0</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Daftar Isi</p>
            {DOCS_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                  activeSection === section.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <section.icon size={18} className={activeSection === section.id ? "text-indigo-600" : "text-slate-400"} />
                {section.title}
                {activeSection === section.id && (
                  <motion.div 
                    layoutId="active-indicator" 
                    className="absolute right-3"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ChevronRight size={16} className="text-indigo-500" />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Support Card in Sidebar */}
        <div className="mt-auto p-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
              <Sparkles size={80} />
            </div>
            <h4 className="font-bold text-sm mb-1 relative z-10">Butuh Bantuan?</h4>
            <p className="text-xs text-indigo-100 mb-3 relative z-10">Pelajari lebih lanjut tentang integrasi API atau laporkan masalah.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-bold transition-colors relative z-10">
              Hubungi Support
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
        <div className="max-w-3xl mx-auto px-10 py-16 pb-32">
          
          <div className="mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-4"
            >
              <Sparkles size={14} /> Documentation
            </motion.div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Panduan Skets Studio</h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Pelajari cara mengoptimalkan platform Skets untuk menganalisis referensi visual Anda dan mengubahnya menjadi struktur JSON yang presisi serta prompt AI profesional.
            </p>
          </div>

          <div className="space-y-24">
            {/* Intro Section */}
            <section id="intro" className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><BookOpen size={28} /></div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pengantar</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6 text-lg">
                <p>
                  <strong>Skets Studio</strong> adalah environment inovatif yang ditenagai oleh <em>Gemini AI Vision</em>, dirancang secara khusus untuk menjembatani kesenjangan antara ide visual mentah (sketsa) dengan kebutuhan produksi aset digital yang terstruktur.
                </p>
                <div className="pl-6 border-l-4 border-indigo-500 py-2 bg-slate-50 pr-4 rounded-r-lg">
                  <p className="text-slate-700 italic font-medium">
                    "Tujuan utama kami adalah memungkinkan kreator mengubah imajinasi visual menjadi data yang dapat dibaca mesin (machine-readable data) dan siap digunakan."
                  </p>
                </div>
                <p>
                  Dengan mengunggah sketsa Anda, mengisi parameter konteks yang relevan, dan menjalankan AI, platform akan mengenali objek, menyusun tata letak ruang, dan memformat semuanya secara otomatis.
                </p>
              </div>
            </section>

            {/* Modes Section */}
            <section id="modes" className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600"><Settings2 size={28} /></div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Mode Analisis</h2>
              </div>
              <p className="text-lg text-slate-600 mb-8">
                Pilih mode yang paling sesuai dengan jenis proyek yang sedang Anda kerjakan untuk mendapatkan output yang paling optimal.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                  className="p-8 border border-slate-200 rounded-2xl bg-white shadow-sm transition-all"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <ImageIcon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Mode Gambar</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Dioptimalkan untuk pembuatan aset tunggal, karakter, environment art, atau ilustrasi spesifik. Model akan berfokus pada detail objek, anatomi, tekstur, dan efek visual.
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                  className="p-8 border border-slate-200 rounded-2xl bg-white shadow-sm transition-all"
                >
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                    <AlignLeft size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Mode Banner</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Dirancang untuk UI/UX, desain grafis, dan material marketing. AI akan memprioritaskan tata letak, proporsi tipografi, whitespace, dan hierarki visual antar elemen.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Image Mode details */}
            <section id="image" className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><ImageIcon size={28} /></div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Konfigurasi Mode Gambar</h2>
              </div>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>Saat menggunakan Mode Gambar, Anda dapat mengontrol keluaran AI dengan mendefinisikan informasi visual secara rinci:</p>
                
                <div className="space-y-4 mt-6">
                  <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Judul & Deskripsi</h4>
                      <p className="text-sm">Menentukan apa inti dari objek yang ada pada gambar. Deskripsi yang mendetail mengenai pose, kostum, atau kondisi lingkungan akan sangat membantu model.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Tema & Warna</h4>
                      <p className="text-sm">Arahkan gaya estetika (misal: <em>Gothic, Minimalist, Pixar 3D, Cyberpunk</em>) dan palet warna dominan (misal: <em>Neon pink, pastel, monochrome</em>).</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Banner Mode Details */}
            <section id="banner" className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-100 rounded-xl text-rose-600"><AlignLeft size={28} /></div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Konfigurasi Mode Banner</h2>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <p className="text-lg text-slate-700 mb-6 font-medium">
                  Pengaturan ini disesuaikan untuk struktur layout grafis komersial:
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                      <span className="text-rose-500">◆</span> Dimensi
                    </h4>
                    <p className="text-sm text-slate-600">Pastikan Anda mendefinisikan orientasi dan resolusi spesifik seperti "1200x630 (Landscape)" untuk mendapatkan komposisi posisi yang akurat.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                      <span className="text-rose-500">◆</span> Copywriting
                    </h4>
                    <p className="text-sm text-slate-600">Teks aktual yang akan di-mapping posisinya oleh AI. Sangat berguna untuk memastikan teks tidak menabrak elemen visual utama.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Analysis & Output */}
            <section id="ai" className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600"><Wand2 size={28} /></div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Struktur JSON & Scene Graph</h2>
              </div>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>
                  Ini adalah inti dari Skets Studio. Alih-alih hanya memberikan gambar jadi, platform kami memberikan <strong>Representasi Matematis dan Terstruktur</strong> dari desain Anda.
                </p>
                
                <div className="bg-[#0D1117] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-800">
                  <div className="px-6 py-3 bg-[#161B22] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-400">hasil_analisis.json</span>
                  </div>
                  <pre className="p-6 text-sm font-mono text-[#E6EDF3] overflow-x-auto leading-relaxed">
<span className="text-[#79C0FF]">"scene_graph"</span>: {'{'}
  <span className="text-[#79C0FF]">"objects"</span>: [
    {'{'}
      <span className="text-[#79C0FF]">"id"</span>: <span className="text-[#A5D6FF]">"char_1"</span>,
      <span className="text-[#79C0FF]">"label"</span>: <span className="text-[#A5D6FF]">"Karakter Utama"</span>,
      <span className="text-[#79C0FF]">"bounding_box"</span>: {'{'}
        <span className="text-[#79C0FF]">"x"</span>: <span className="text-[#79C0FF]">120</span>,
        <span className="text-[#79C0FF]">"y"</span>: <span className="text-[#79C0FF]">50</span>
      {'}'}
    {'}'}
  ],
  <span className="text-[#79C0FF]">"master_prompt"</span>: <span className="text-[#A5D6FF]">"A high quality illustration of..."</span>
{'}'}
                  </pre>
                </div>
                
                <p>
                  JSON ini bisa Anda <code>Copy</code> atau <code>Export</code> langsung ke dalam sistem UI generator, pipeline animasi 3D, atau front-end code generation Anda.
                </p>
              </div>
            </section>

            {/* Integration Section */}
            <section id="integration" className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600"><Code size={28} /></div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Integrasi & Penggunaan</h2>
              </div>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>
                  Master Prompt yang digenerate oleh AI sengaja diformat dengan keyword teknis standar industri (seperti <em>"highres, masterpiece, volumetric lighting"</em>) agar dapat langsung di-copy-paste ke platform Text-to-Image populer.
                </p>
                <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 text-xl mb-4">Fitur Layers / Objects</h3>
                  <p className="text-indigo-800 mb-0">
                    Sistem mendeteksi objek satu per satu yang ditampilkan di panel kiri. Anda dapat melakukan fungsi <strong>Lock</strong> (kunci) pada objek tertentu, sehingga saat Anda melakukan iterasi/re-generate, objek yang dikunci akan tetap dipertahankan propertinya.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
