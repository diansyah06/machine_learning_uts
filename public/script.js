// Global variables

// DOM Elements
const form = document.getElementById('predict-form');
const predictBtn = document.getElementById('predict-btn');
const resultsSection = document.getElementById('results-section');
const errorSection = document.getElementById('error-section');
const btnText = document.querySelector('.btn-text');
const loadingSpinner = document.querySelector('.loading-spinner');

// Show loading state
function showLoading() {
  predictBtn.disabled = true;
  btnText.style.display = 'none';
  loadingSpinner.style.display = 'flex';
  resultsSection.style.display = 'none';
  errorSection.style.display = 'none';
}

// Hide loading state
function hideLoading() {
  predictBtn.disabled = false;
  btnText.style.display = 'flex';
  loadingSpinner.style.display = 'none';
}

// Show error message
function showError(message, suggestions = '') {
  hideLoading();
  
  const errorMessage = document.getElementById('error-message');
  const errorSuggestions = document.getElementById('error-suggestions');
  
  errorMessage.textContent = message;
  errorSuggestions.textContent = suggestions;
  
  resultsSection.style.display = 'none';
  errorSection.style.display = 'block';
  
  // Scroll to error section
  errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Show results
function showResults(data) {
  hideLoading();

  // Update location info
  document.getElementById('result-city').textContent = data.city;

  // Update AI prediction
  document.getElementById('predicted-pm25').textContent = data.aiPrediction.predicted_pm25.toFixed(1);

  // Update predicted category
  const predictedCategory = document.querySelector('#predicted-category .category-badge');
  predictedCategory.textContent = data.aiPrediction.category;
  predictedCategory.style.background = data.aiPrediction.color;
  predictedCategory.style.color = 'white';

  // Update trend
  const trendIcon = data.aiPrediction.trend === 'increasing' ? 'fa-arrow-up' : 'fa-arrow-down';
  const trendColor = data.aiPrediction.trend === 'increasing' ? '#F44336' : '#4CAF50';

  const trendInfo = document.getElementById('trend-info');
  trendInfo.innerHTML = `
    <i class="fas ${trendIcon}" style="color: ${trendColor};"></i>
    <span style="color: ${trendColor};">Trend: ${data.aiPrediction.trend === 'increasing' ? 'Meningkat' : 'Menurun'}</span>
  `;

  // Update analysis section if available
  if (data.aiPrediction.analisis) {
    document.getElementById('actual-last').textContent = `${data.aiPrediction.analisis.nilai_aktual_terakhir} µg/m³`;
    document.getElementById('pred-avg').textContent = `${data.aiPrediction.analisis.rata_rata_prediksi} µg/m³`;
    document.getElementById('pred-range').textContent = data.aiPrediction.analisis.rentang_prediksi;
    document.getElementById('trend-delta').textContent = `${data.aiPrediction.analisis.perubahan_tren} µg/m³`;
    document.getElementById('trend-direction').textContent = data.aiPrediction.analisis.arah_tren;
    document.getElementById('quality-category').textContent = data.aiPrediction.analisis.kategori_kualitas;
    document.getElementById('change-percent').textContent = `${data.aiPrediction.analisis.persentase_perubahan}%`;

    // Show analysis section
    document.getElementById('analysis-section').style.display = 'block';
  }

  // Show results section
  resultsSection.style.display = 'block';
  errorSection.style.display = 'none';

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Get category color
function getCategoryColor(category) {
  const colors = {
    'Baik': '#4CAF50',
    'Sedang': '#FFC107',
    'Tidak Sehat untuk Kelompok Sensitif': '#FF9800',
    'Tidak Sehat': '#F44336',
    'Sangat Tidak Sehat': '#9C27B0',
    'Berbahaya': '#B71C1C'
  };
  return colors[category] || '#9E9E9E';
}


// Reset form
function resetForm() {
  document.getElementById('region').value = '';
  resultsSection.style.display = 'none';
  errorSection.style.display = 'none';
  hideLoading();


  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Form submission handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const region = document.getElementById('region').value;

  if (!region) {
    showError('Silakan pilih wilayah');
    return;
  }

  showLoading();

  try {
    console.log(`🔍 Mengirim prediksi untuk wilayah: ${region}`);

    // Prepare form data
    const formData = new FormData();
    formData.append('region', region);

    const response = await fetch('/predict', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Terjadi kesalahan dalam prediksi');
    }
    
    if (!data.success) {
      throw new Error(data.error || 'Prediksi gagal');
    }
    
    console.log('✅ Data prediksi diterima:', data);
    showResults(data);
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    let errorMessage = 'Terjadi kesalahan saat memproses prediksi';
    let suggestions = 'Periksa koneksi internet Anda dan coba lagi.';
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Tidak dapat terhubung ke server';
      suggestions = 'Pastikan server berjalan di localhost:5623';
    } else if (error.message.includes('network')) {
      errorMessage = 'Masalah koneksi jaringan';
      suggestions = 'Periksa koneksi internet Anda';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showError(errorMessage, suggestions);
  }
});

// Region select enhancement
const regionSelect = document.getElementById('region');
regionSelect.addEventListener('change', (e) => {
  // Add some visual feedback
  if (e.target.value) {
    e.target.style.borderColor = '#4CAF50';
  } else {
    e.target.style.borderColor = '#e0e0e0';
  }
});

// Add some initial animation when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Fade in animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 1s ease-in-out';
    document.body.style.opacity = '1';
  }, 100);
  
  // Add focus to region select
  setTimeout(() => {
    regionSelect.focus();
  }, 1000);
});

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.region) {
    document.getElementById('region').value = e.state.region;
    // Optionally trigger prediction again
  }
});

// Export for global access
window.resetForm = resetForm;
