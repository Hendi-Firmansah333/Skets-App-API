# 🎨 Skets App

Skets App adalah aplikasi cerdas berbasis web yang dirancang untuk menganalisis dan memproses gambar menggunakan kekuatan *Artificial Intelligence* (Google Gemini AI). Proyek ini dibangun dengan arsitektur modern yang memisahkan bagian *Frontend* dan *Backend* untuk performa, skalabilitas, dan pengalaman pengguna yang optimal.

---

## 🚀 Fitur Utama
- **AI-Powered Image Analysis**: Menganalisis sketsa atau gambar yang diunggah pengguna menggunakan teknologi Computer Vision dari Google Gemini.
- **Modern User Interface**: Antarmuka yang responsif, cepat, dan interaktif.
- **Object Storage**: Penyimpanan file/gambar yang aman dan efisien menggunakan MinIO.
- **High Performance**: Didukung oleh caching menggunakan Redis dan backend asinkron dengan FastAPI.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan *tech-stack* mutakhir:

### 🌐 Frontend (Client-Side)
- **Framework:** [Next.js](https://nextjs.org/) (React Framework)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS / Modern CSS
- **Package Manager:** npm / yarn

### ⚙️ Backend (Server-Side)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ORM:** SQLAlchemy (dengan Alembic untuk *database migrations*)
- **AI Integration:** Google GenAI (Gemini AI)
- **Validasi Data:** Pydantic

### 🗄️ Infrastruktur & Database
- **Database:** PostgreSQL 15
- **Caching:** Redis 7
- **Object Storage:** MinIO (Alternatif S3)
- **Containerization:** Docker & Docker Compose

---

## 📂 Struktur Direktori

```text
skets-app/
│
├── backend/            # Source code untuk FastAPI Backend
│   ├── app/            # Logika utama aplikasi (Router, Services, Models)
│   ├── requirements.txt# Daftar dependency Python
│   └── .env            # Konfigurasi environment backend
│
├── frontend/           # Source code untuk Next.js Frontend
│   ├── src/            # Komponen dan halaman antarmuka
│   ├── package.json    # Daftar dependency Node.js
│   └── ...
│
├── docker-compose.yml  # Konfigurasi container untuk DB, Redis, dan MinIO
└── .gitignore          # Daftar file yang dikecualikan dari Git
```

---

## 🏃‍♂️ Cara Menjalankan Proyek Secara Lokal

### 1. Jalankan Infrastruktur (Docker)
Pastikan Docker sudah terinstal, lalu jalankan perintah berikut di root folder untuk menyalakan database, Redis, dan MinIO:
```bash
docker-compose up -d
```

### 2. Jalankan Backend (FastAPI)
Buka terminal baru, arahkan ke folder `backend`, lalu jalankan server:
```bash
cd backend
# Aktifkan virtual environment (contoh untuk Windows)
..\.venv\Scripts\activate
# Instal dependencies (jika belum)
pip install -r requirements.txt
# Jalankan server FastAPI
uvicorn app.main:app --reload
```
*Backend akan berjalan di `http://localhost:8000` (Dokumentasi API tersedia di `/docs`).*

### 3. Jalankan Frontend (Next.js)
Buka terminal baru, arahkan ke folder `frontend`, lalu jalankan server *development*:
```bash
cd frontend
# Instal dependencies
npm install
# Jalankan frontend
npm run dev
```
*Frontend akan berjalan di `http://localhost:3000`.*

---

## 🤝 Kontribusi
Jika Anda ingin berkontribusi pada proyek ini, silakan buat *Pull Request* atau *Issue* di repository ini.

*Dibuat dengan ❤️ untuk komunitas developer. Salam Developer....*
