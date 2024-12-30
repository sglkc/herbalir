# HerbalIR

Information retrieval dengan metode Fuzzy Full Text Search (minisearch)
dengan stemmer dan tokenizer Bahasa Indonesia (sastrawijs)
menggunakan dokumen PDF untuk mencari tanaman herbal.

## Cara menggunakan

### Clone repository

```sh
git clone https://github.com/sglkc/herbalir.git
cd herbalir
```

### Menambahkan dokumen

1. Download dokumen berupa file PDF
2. Simpan dokumen PDF ke folder `pdf`

### Ekstraksi teks

```sh
python -m pip install -r requirements.txt
python extractor.py
```

Hasil ekstraksi akan disimpan dalam file `data.json`. Ekstraksi judul tidak selalu benar, cek ulang data judul sebelum digunakan.

### Membuka antarmuka

1. Simpan folder ini dalam `htdocs` dalam XAMPP atau `www` dalam Laragon
2. Jalankan web server Apache
3. Buka `localhost/{nama folder}` atau domain dari Laragon

## Laporan ditunggu trims.
