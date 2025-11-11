# Sistem Prediksi Kualitas Udara AI - Deep Learning Ensemble

Sistem web-based untuk memprediksi kualitas udara (PM2.5) menggunakan model Machine Learning ensemble yang terdiri dari Random Forest, XGBoost, dan Neural Network. Sistem ini menyediakan prediksi 1 hari ke depan dengan analisis kualitas hasil prediksi secara real-time.

## 🚀 Fitur Utama

- **Prediksi Real-time**: Prediksi kualitas udara 1 hari ke depan
- **Ensemble Model**: Kombinasi 3 model ML (RF + XGBoost + NN) dengan bobot optimal
- **Analisis Kualitas**: Evaluasi mendalam hasil prediksi vs data aktual
- **Interface Modern**: UI responsif dengan tampilan yang user-friendly
- **Multi-Region**: Mendukung berbagai wilayah di Indonesia
- **Data Visualization**: Analisis tren dan statistik lengkap

## 🏗️ Arsitektur Sistem

```
Frontend (HTML/CSS/JS) ←→ Backend (Node.js/Hapi) ←→ Python ML Models
       ↓                           ↓                           ↓
   User Interface          API Routes & Logic         Ensemble Prediction
   - Region Selection      - Data Processing          - RF Model (40%)
   - Results Display       - Error Handling           - XGBoost Model (40%)
   - Analysis Charts       - Response Formatting      - NN Model (20%)
```

## 📊 Model Machine Learning

### Ensemble Architecture
- **Random Forest**: 40% bobot - Robust terhadap outliers
- **XGBoost**: 40% bobot - High performance gradient boosting
- **Neural Network**: 20% bobot - Deep learning untuk pola kompleks

### Fitur Input
- Time-based features (hour, day, month dengan encoding siklikal)
- Geographic features (latitude, longitude)
- Categorical encoding (region, parameter)
- Historical patterns dari dataset

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime JavaScript
- **Hapi.js** - Framework web server
- **Python 3** - Machine Learning runtime

### Frontend
- **HTML5/CSS3** - Modern web standards
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Data visualization (opsional)

### Machine Learning
- **Scikit-learn** - Random Forest & preprocessing
- **XGBoost** - Gradient boosting
- **TensorFlow/Keras** - Neural Network
- **Joblib** - Model serialization
- **Pandas/NumPy** - Data processing

## 📁 Struktur Proyek

```
webandmodel/
├── models/                    # Trained ML models
│   ├── model_rf.pkl          # Random Forest model
│   ├── model_xgb_best.pkl    # XGBoost model
│   ├── model_nn.h5           # Neural Network model
│   ├── scaler.pkl            # Feature scaler
│   └── encoder.pkl           # Label encoder
├── dataset/                   # Regional datasets
│   ├── medan.csv
│   ├── depok.csv
│   ├── bogorselatan.csv
│   ├── dmalldepok.csv
│   ├── kopernik.csv
│   └── ubud.csv
├── public/                    # Frontend assets
│   ├── index.html            # Main interface
│   ├── style.css             # Styling
│   └── script.js             # Client-side logic
├── routes/                    # API routes
│   └── predict.js            # Prediction endpoint
├── server.js                  # Main server file
├── predict.py                 # ML prediction script
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- pip (Python package manager)

### 1. Clone Repository
```bash
git clone <repository-url>
cd webandmodel
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Install Python Dependencies
```bash
pip install scikit-learn xgboost tensorflow pandas numpy joblib
```

### 4. Setup Models
Pastikan folder `models/` berisi file model yang telah dilatih:
- `model_rf.pkl`
- `model_xgb_best.pkl`
- `model_nn.h5`
- `scaler.pkl`
- `encoder.pkl`

### 5. Setup Datasets
Pastikan folder `dataset/` berisi file CSV untuk setiap wilayah yang didukung.

### 6. Jalankan Server
```bash
node server.js
# atau dengan auto-reload
npx nodemon server.js
```

### 7. Akses Aplikasi
Buka browser dan akses: `http://localhost:5623`

## 📖 Cara Penggunaan

1. **Pilih Wilayah**: Pilih wilayah dari dropdown yang tersedia
2. **Kirim Permintaan**: Klik tombol "Ambil Data & Prediksi"
3. **Lihat Hasil**: Sistem akan menampilkan:
   - Prediksi PM2.5 untuk 1 hari ke depan
   - Kategori kualitas udara
   - Analisis tren (meningkat/menurun)
   - Analisis kualitas prediksi lengkap

## 🔬 Analisis Kualitas Prediksi

Sistem menyediakan analisis mendalam untuk setiap prediksi:

- **Nilai Aktual Terakhir**: Data PM2.5 terakhir dari dataset
- **Rata-rata Prediksi**: Rata-rata nilai prediksi 24 jam
- **Rentang Prediksi**: Kisaran nilai minimum-maksimum
- **Perubahan Tren**: Delta nilai dari awal ke akhir periode
- **Arah Tren**: Klasifikasi tren (Meningkat/Menurun/Stabil)
- **Kategori Kualitas**: Klasifikasi udara berdasarkan standar
- **% Perubahan**: Persentase perubahan terhadap data aktual

## 📈 Kategori Kualitas Udara

Berdasarkan standar PM2.5 WHO:
- **0-12 µg/m³**: Baik
- **13-35 µg/m³**: Sedang
- **36-55 µg/m³**: Tidak Sehat (Sensitif)
- **56-150 µg/m³**: Tidak Sehat
- **151-250 µg/m³**: Sangat Tidak Sehat
- **>250 µg/m³**: Berbahaya

## 🔧 API Endpoint

### POST /predict
Endpoint utama untuk prediksi kualitas udara.

**Request Body:**
```json
{
  "region": "medan"
}
```

**Response:**
```json
{
  "success": true,
  "city": "Medan Bung",
  "aiPrediction": {
    "predicted_pm25": 34.15,
    "category": "Sedang",
    "trend": "decreasing",
    "forecastHours": 24,
    "analisis": {
      "nilai_aktual_terakhir": 5225.38,
      "rata_rata_prediksi": 34.15,
      "rentang_prediksi": "31.25 – 37.89",
      "perubahan_tren": -2.34,
      "arah_tren": "Menurun",
      "kategori_kualitas": "Sedang",
      "persentase_perubahan": -98.45
    },
    "color": "#FFC107"
  },
  "timestamp": "2025-11-10T23:09:03.376Z"
}
```

## 🧪 Testing

### Test Prediksi
```bash
# Test dengan curl
curl -X POST http://localhost:5623/predict \
  -H "Content-Type: application/json" \
  -d '{"region": "medan"}'
```

### Test Python Script Langsung
```bash
python predict.py 45.2 "Medan" "dataset/medan.csv"
```

## 📊 Dataset Format

Format CSV yang diharapkan untuk setiap wilayah:

```csv
location_id,location_name,parameter,value,unit,datetimeUtc,datetimeLocal,timezone,latitude,longitude,country_iso,isMobile,isMonitor,owner_name,provider
5586536,"Medan Bung","pm25",45.2,"µg/m³","2025-11-10T09:00:00Z","2025-11-10T16:00:00+07:00","Asia/Jakarta",3.539102,98.615361,,,,"AirGradient","AirGradient"
```

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Distributed under the ISC License. See `LICENSE` for more information.

## 👨‍💻 Author

**OFFSIDE**

## 🙏 Acknowledgments

- OpenAQ untuk data kualitas udara
- Scikit-learn, XGBoost, TensorFlow communities
- Hapi.js framework
- Font Awesome untuk icons

---

**Catatan**: Sistem ini menggunakan model Machine Learning yang telah dilatih sebelumnya. Untuk hasil prediksi yang optimal, pastikan model-model di folder `models/` telah dilatih dengan data yang representative dan up-to-date.