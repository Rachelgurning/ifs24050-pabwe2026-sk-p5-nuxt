# Delcom Cash Flow — Nuxt 4

Aplikasi pencatatan arus kas dengan Nuxt 4 SPA, TypeScript, Tailwind CSS v4, Pinia, API Delcom, Vitest, dan konfigurasi CI Jenkins + SonarQube.

## Prasyarat

- Bun 1.2 atau lebih baru
- Node.js 22+ (tooling Nuxt)
- Akses jaringan ke API Delcom untuk menguji alur yang memerlukan backend
- Jenkins dengan Docker Pipeline dan SonarQube Scanner for Jenkins untuk CI

## Jalankan UI secara lokal

```powershell
Copy-Item .env.example .env
bun install
bun run dev
```

Buka `http://localhost:3000`. Jika port 3000 sedang digunakan, ubah `APP_PORT` di `.env`. Repository ini disiapkan dengan nama `ifs24050-pabwe2026-sk-p5-nuxt`.

## Perintah verifikasi

```powershell
bun run typecheck
bun run test:run
bun run test:coverage
bun run build
```

`test:coverage` menghasilkan laporan teks dan `coverage/lcov.info` untuk SonarQube. Coverage dilaporkan secara jujur; persentase 100% tidak dijanjikan dan perlu dicapai dengan tes untuk semua jalur kode.

## Production / Docker

```powershell
bun run build
bun run preview
```

Atau bangun dan jalankan image:

```powershell
docker build -t delcom-cash-flow .
docker run --rm -p 3000:3000 delcom-cash-flow
```

## Jenkins + SonarQube

1. Push repository ini ke GitHub dan buat Jenkins Pipeline job yang menunjuk ke repository tersebut.
2. Pasang plugin **Docker Pipeline**, **SonarQube Scanner for Jenkins**, dan **Pipeline: Stage View**.
3. Pada **Manage Jenkins → System**, tambahkan instalasi server SonarQube dengan nama persis `SonarQube`.
4. Konfigurasikan token autentikasi SonarQube melalui kredensial Jenkins, lalu aktifkan webhook SonarQube ke `https://<alamat-jenkins>/sonarqube-webhook/`.
5. Pastikan agen Jenkins dapat menjalankan Docker dan menarik image `oven/bun:1.2.22` serta `sonarsource/sonar-scanner-cli:latest`.
6. Jalankan pipeline dari branch yang berisi `Jenkinsfile`.

Pipeline menjalankan typecheck, unit tests, coverage, build, analisis SonarQube, lalu Quality Gate. Tahap Quality Gate dapat gagal jika server SonarQube menolak kualitas proyek atau webhook/kredensial belum dikonfigurasi. Itu adalah status server, bukan kegagalan yang dapat diperbaiki hanya dari source code.

## Catatan API

- Base URL default: `https://open-api.delcom.org/api/v1`.
- Ubah `VITE_DELCOM_BASEURL` jika lingkungan API yang dipakai dosen berbeda.
- Login API Delcom menggunakan **email dan password**. Registrasi menggunakan **nama, email unik, dan password** (bukan username).
- Operasi yang membutuhkan akun/token memerlukan API Delcom yang dapat diakses; halaman UI tetap dapat dibuka tanpa token, tetapi request data akan menampilkan pesan error bila API tidak tersedia.
- Jangan commit `.env` atau token API ke Git.
