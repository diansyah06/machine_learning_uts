// routes/predict.js — Hapi route (final, robust)
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const getAirQualityCategory = (pm25) => {
  if (pm25 <= 12) return 'Baik';
  if (pm25 <= 35) return 'Sedang';
  if (pm25 <= 55) return 'Tidak Sehat untuk Kelompok Sensitif';
  if (pm25 <= 150) return 'Tidak Sehat';
  if (pm25 <= 250) return 'Sangat Tidak Sehat';
  return 'Berbahaya';
};

const getCategoryColor = (category) => {
  const colors = {
    'Baik': '#4CAF50',
    'Sedang': '#FFC107',
    'Tidak Sehat untuk Kelompok Sensitif': '#FF9800',
    'Tidak Sehat': '#F44336',
    'Sangat Tidak Sehat': '#9C27B0',
    'Berbahaya': '#B71C1C'
  };
  return colors[category] || '#9E9E9E';
};

const baseDir = process.cwd();
const datasetDir = path.join(baseDir, "dataset");
const pythonScript = path.join(baseDir, "predict.py");

async function runPythonPredict(pm25, region, datasetPath) {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      TF_CPP_MIN_LOG_LEVEL: "3",
      TF_ENABLE_ONEDNN_OPTS: "0",
      PYTHONIOENCODING: "utf-8",
    };

    const pythonProcess = spawn("python", [pythonScript, pm25, region, datasetPath], {
      env,
      windowsHide: true,
    });

    let out = "";
    let err = "";

    pythonProcess.stdout.on("data", (d) => (out += d.toString()));
    pythonProcess.stderr.on("data", (d) => (err += d.toString()));

    pythonProcess.on("close", (code) => {
      // Selalu coba parse stdout dulu
      const jsonLine = (out || "")
        .split("\n")
        .map((s) => s.trim())
        .find((s) => s.startsWith("{") || s.startsWith("["));

      if (jsonLine) {
        try {
          const parsed = JSON.parse(jsonLine);
          return resolve(parsed);
        } catch (e) {
          // fallthrough ke error handling di bawah
        }
      }
      // Kalau tidak ada JSON, barulah anggap error
      reject(new Error(err || "Python process failed"));
    });
  });
}

module.exports = {
  method: "POST",
  path: "/predict",
  options: {
    description: "Prediksi kualitas udara berbasis model AI",
    tags: ["api"],
    payload: { multipart: true, output: "data", parse: true },
  },
  handler: async (request, h) => {
    try {
      const { region } = request.payload || {};
      const regionName = (region || "Medan").toLowerCase();
      const datasetPath = path.join(datasetDir, `${regionName}.csv`);

      console.log(`📁 Using local dataset for ${regionName}: ${datasetPath}`);
      if (!fs.existsSync(datasetPath)) {
        return h.response({ success: false, message: `Dataset untuk ${regionName} tidak ditemukan.` }).code(404);
      }

      const csvData = fs.readFileSync(datasetPath, "utf-8");
      const rows = csvData.trim().split("\n");
      if (rows.length < 2) {
        return h.response({ success: false, message: "Dataset kosong." }).code(400);
      }
      const header = rows[0].split(",");
      const last = rows[rows.length - 1].split(",");
      // kolom "value" ada di index 3 → sesuaikan jika header berubah
      const valueIdx = Math.max(3, header.indexOf("value"));
      const latestPM25 = parseFloat(last[valueIdx]) || 0;

      console.log(`🔍 Mengambil data kualitas udara untuk: ${regionName}`);
      console.log(`📊 Latest measurement: PM2.5 = ${latestPM25} µg/m³`);
      console.log(`🤖 Running AI prediction: python ${pythonScript} ${latestPM25} ${regionName} ${datasetPath}\n`);

      const result = await runPythonPredict(latestPM25, regionName, datasetPath);

      if (!result.success) {
        return h.response({ success: false, message: result.message || "Prediksi gagal dijalankan." }).code(500);
      }

      return h.response({
        success: true,
        city: result.region || regionName,
        aiPrediction: {
          predicted_pm25: result.predicted_mean,
          category: result.kategori,
          trend: result.trend === "menurun" ? "decreasing" : "increasing",
          forecastHours: 24,
          analisis: result.analisis,
          color: getCategoryColor(result.kategori),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Prediksi gagal:", error);
      return h.response({ success: false, message: error.message || "Terjadi kesalahan pada server." }).code(500);
    }
  },
};
