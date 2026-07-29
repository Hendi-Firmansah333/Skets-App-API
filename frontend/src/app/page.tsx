"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Upload, Download, Layers, Wand2, Settings2, Image as ImageIcon, Play, Sparkles, Loader2, Lock, Unlock, AlignLeft, Palette, Copy, Check, FileText } from "lucide-react";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Konva component to avoid SSR issues
const SketchEditor = dynamic(() => import("../components/canvas/SketchEditor"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-50 rounded-xl">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  )
});

export default function WorkspacePage() {
  const { 
    imageUrl, setImageUrl, 
    isAnalyzing, setAnalyzing,
    detectedObjects, setDetectedObjects, toggleObjectLock,
    structuredJson, setStructuredJson,
    masterPrompt, setMasterPrompt,
    qualityLevel, setQualityLevel,
    configTitle, setConfigTitle,
    configDescription, setConfigDescription,
    configTheme, setConfigTheme,
    configColors, setConfigColors,
    configInstructions, setConfigInstructions,
    outputType, setOutputType,
    bannerSize, setBannerSize,
    bannerTitle, setBannerTitle,
    bannerElements, setBannerElements,
    bannerContentText, setBannerContentText,
    bannerColors, setBannerColors
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"config" | "layers">("config");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (structuredJson) {
      navigator.clipboard.writeText(JSON.stringify(structuredJson, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setDetectedObjects([]);
      setStructuredJson(null);
      setMasterPrompt("");
    }
  };

  const runAnalysis = async () => {
    if (!imageFile) return;
    
    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("output_type", outputType);
      
      if (outputType === "banner") {
        formData.append("banner_size", bannerSize);
        formData.append("banner_title", bannerTitle);
        formData.append("banner_elements", bannerElements);
        formData.append("banner_content", bannerContentText);
        formData.append("banner_colors", bannerColors);
        formData.append("instructions", configInstructions);
      } else {
        formData.append("title", configTitle);
        formData.append("description", configDescription);
        formData.append("theme", configTheme);
        formData.append("colors", configColors);
        formData.append("instructions", configInstructions);
      }

      const response = await fetch("http://localhost:8000/api/v1/analysis/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      
      if (data.status === "success" && data.data) {
        const result = data.data;
        
        // Map backend objects to frontend state
        if (result.detected_objects) {
          setDetectedObjects(result.detected_objects.map((obj: any) => ({
            ...obj,
            locked: false,
            confidence: 1.0 // Gemini doesn't return confidence normally, we assume 1.0
          })));
        }
        
        setStructuredJson(result.scene_graph);
        setMasterPrompt(result.master_prompt);
        setActiveTab("layers"); // Switch to layers tab to show detected objects
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Gagal terhubung ke AI Backend. Pastikan backend berjalan dan API Key terpasang.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
      {/* Top Navbar */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
            <Sparkles size={18} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-800">Skets Studio</span>
          <div className="ml-4 flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Project: {configTitle || "Untitled"}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/docs" className="flex items-center gap-2 mr-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            <FileText size={16} />
            Dokumentasi
          </Link>
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50" disabled={!structuredJson}>
            <Download size={16} />
            Export JSON
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runAnalysis}
            disabled={!imageUrl || isAnalyzing}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="fill-white" />}
            {isAnalyzing ? "Analyzing Scene..." : "Run AI Analysis"}
          </motion.button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Configuration & Layers */}
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)] hidden md:flex shrink-0">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab("config")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'config' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Konfigurasi Desain
            </button>
            <button 
              onClick={() => setActiveTab("layers")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'layers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Layers / Objects
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
            <AnimatePresence mode="wait">
              {activeTab === "config" ? (
                <motion.div 
                  key="config"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setOutputType("image")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${outputType === "image" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Mode Gambar
                    </button>
                    <button
                      onClick={() => setOutputType("banner")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${outputType === "banner" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Mode Banner
                    </button>
                  </div>

                  {outputType === "image" ? (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <AlignLeft size={16} className="text-indigo-500" />
                          Informasi Utama
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Judul / Subjek Utama</label>
                          <input 
                            type="text" 
                            value={configTitle}
                            onChange={(e) => setConfigTitle(e.target.value)}
                            placeholder="E.g. Karakter Robot Samurai"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Deskripsi Spesifik</label>
                          <textarea 
                            value={configDescription}
                            onChange={(e) => setConfigDescription(e.target.value)}
                            placeholder="Detail pakaian, suasana, aksi yang sedang dilakukan..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Palette size={16} className="text-indigo-500" />
                          Spesifikasi Visual
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Tema Desain</label>
                          <input 
                            type="text" 
                            value={configTheme}
                            onChange={(e) => setConfigTheme(e.target.value)}
                            placeholder="E.g. Cyberpunk, Minimalist, Pixar 3D"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Warna Dominan</label>
                          <input 
                            type="text" 
                            value={configColors}
                            onChange={(e) => setConfigColors(e.target.value)}
                            placeholder="E.g. Neon Pink dan Biru"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Settings2 size={16} className="text-indigo-500" />
                          Instruksi Khusus
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Prompt Pendukung</label>
                          <textarea 
                            value={configInstructions}
                            onChange={(e) => setConfigInstructions(e.target.value)}
                            placeholder="Instruksi tambahan yang wajib diikuti AI (Misal: jangan ubah posisi elemen, tambahkan efek hujan)"
                            rows={4}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <AlignLeft size={16} className="text-indigo-500" />
                          Informasi Banner
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Ukuran / Orientasi</label>
                          <input 
                            type="text" 
                            value={bannerSize}
                            onChange={(e) => setBannerSize(e.target.value)}
                            placeholder="E.g. 1200x630 (Landscape)"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Judul Banner</label>
                          <input 
                            type="text" 
                            value={bannerTitle}
                            onChange={(e) => setBannerTitle(e.target.value)}
                            placeholder="E.g. Promo Kemerdekaan"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Palette size={16} className="text-indigo-500" />
                          Spesifikasi Konten
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Elemen Visual</label>
                          <textarea 
                            value={bannerElements}
                            onChange={(e) => setBannerElements(e.target.value)}
                            placeholder="E.g. Logo di kiri atas, gambar produk..."
                            rows={2}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Konten / Copywriting</label>
                          <textarea 
                            value={bannerContentText}
                            onChange={(e) => setBannerContentText(e.target.value)}
                            placeholder="E.g. Diskon 50% untuk semua item..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Warna Dominan</label>
                          <input 
                            type="text" 
                            value={bannerColors}
                            onChange={(e) => setBannerColors(e.target.value)}
                            placeholder="E.g. Merah Putih"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Settings2 size={16} className="text-indigo-500" />
                          Instruksi Khusus
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Prompt Pendukung</label>
                          <textarea 
                            value={configInstructions}
                            onChange={(e) => setConfigInstructions(e.target.value)}
                            placeholder="Instruksi tambahan yang wajib diikuti AI..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="layers"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col gap-2"
                >
                  <p className="text-xs text-slate-500 mb-2 px-1">Objek yang terdeteksi dari hasil analisis gambar.</p>
                  {detectedObjects.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-lg">
                      <Layers className="mx-auto text-slate-300 mb-2" size={24} />
                      <p className="text-xs text-slate-400">Belum ada objek. Run AI Analysis terlebih dahulu.</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {detectedObjects.map(obj => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={obj.id} 
                          className={`flex items-center justify-between rounded-md p-2 border transition-all cursor-pointer bg-white shadow-sm ${obj.locked ? 'bg-rose-50 border-rose-200' : 'hover:bg-slate-50 border-slate-200 hover:border-indigo-300'}`}
                        >
                          <span className={`text-sm ${obj.locked ? 'text-rose-700 font-medium' : 'text-slate-700'}`}>{obj.label}</span>
                          <button onClick={() => toggleObjectLock(obj.id)} className="p-1 hover:bg-slate-100 rounded transition-colors">
                            {obj.locked ? <Lock size={14} className="text-rose-600" /> : <Unlock size={14} className="text-slate-400" />}
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Center - Canvas Editor */}
        <main className="flex-1 relative bg-slate-100 flex flex-col p-8 overflow-hidden">
          <div className={`w-full h-full bg-white rounded-xl shadow-lg border ${imageUrl ? 'border-solid border-slate-200' : 'border-dashed border-slate-300'} flex flex-col items-center justify-center relative overflow-hidden`}>
            
            {!imageUrl ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center z-10"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                  <ImageIcon size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Upload Sketsa atau Referensi</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-xs">AI akan menganalisis objek dan mempertahankannya sesuai referensi visual Anda.</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 flex items-center gap-2 mx-auto rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <Upload size={16} />
                  Pilih Gambar
                </button>
              </motion.div>
            ) : (
              <SketchEditor imageUrl={imageUrl} detectedObjects={detectedObjects} />
            )}

            {/* Loading Overlay */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4 shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">AI Vision Sedang Bekerja...</h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-sm text-center">Menyatukan sketsa visual Anda dengan konfigurasi teks untuk menghasilkan struktur data presisi tinggi.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Right Sidebar - Output & Settings */}
        <aside className="w-96 border-l border-slate-200 bg-white flex flex-col z-10 shadow-[-2px_0_10px_rgba(0,0,0,0.02)] hidden lg:flex shrink-0">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <Wand2 size={16} className="text-indigo-500" />
              Hasil Generate AI
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 bg-white">
            {/* Prompt Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Master Prompt (Ready to Use)
                </label>
              </div>
              <motion.div 
                layout
                className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-inner min-h-[140px] transition-all leading-relaxed"
              >
                {masterPrompt || <span className="text-slate-400 italic">Menunggu analisis untuk menghasilkan prompt yang sempurna...</span>}
              </motion.div>
            </div>
            
            {/* JSON Output */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Structured Scene Graph (JSON)
                </label>
                <button
                  onClick={handleCopy}
                  disabled={!structuredJson}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <motion.div 
                layout
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-700 shadow-sm flex-1 font-mono overflow-auto whitespace-pre leading-relaxed backdrop-blur-sm"
              >
                {structuredJson ? JSON.stringify(structuredJson, null, 2) : <span className="text-slate-400 italic">// Representasi JSON akan muncul di sini...</span>}
              </motion.div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
