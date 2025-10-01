// JPG to PNG Dönüştürücü
function initializeJpgToPng() {
    const form = document.getElementById('jpgToPngForm');
    const fileInput = document.getElementById('jpgFile');
    const resultDiv = document.getElementById('jpgToPngResult');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!fileInput.files.length) {
            showError(resultDiv, 'Lütfen bir JPG dosyası seçin.');
            return;
        }

        const file = fileInput.files[0];
        
        // Dosya tipi kontrolü
        if (!file.type.match('image/jpeg')) {
            showError(resultDiv, 'Lütfen sadece JPG dosyası seçin.');
            return;
        }

        // Dosya boyutu kontrolü (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError(resultDiv, 'Dosya boyutu 10MB\'dan küçük olmalıdır.');
            return;
        }

        convertJpgToPng(file, resultDiv);
    });
}

// PNG to JPG Dönüştürücü
function initializePngToJpg() {
    const form = document.getElementById('pngToJpgForm');
    const fileInput = document.getElementById('pngFile');
    const resultDiv = document.getElementById('pngToJpgResult');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!fileInput.files.length) {
            showError(resultDiv, 'Lütfen bir PNG dosyası seçin.');
            return;
        }

        const file = fileInput.files[0];
        
        // Dosya tipi kontrolü
        if (!file.type.match('image/png')) {
            showError(resultDiv, 'Lütfen sadece PNG dosyası seçin.');
            return;
        }

        // Dosya boyutu kontrolü (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError(resultDiv, 'Dosya boyutu 10MB\'dan küçük olmalıdır.');
            return;
        }

        convertPngToJpg(file, resultDiv);
    });
}

// JPG to PNG dönüştürme fonksiyonu
function convertJpgToPng(file, resultDiv) {
    showLoading(resultDiv, 'JPG dosyası PNG formatına dönüştürülüyor...');

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        
        img.onload = function() {
            // Canvas oluştur
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            
            // Beyaz arkaplan (JPG'de alpha kanalı olmadığı için)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Resmi çiz
            ctx.drawImage(img, 0, 0);
            
            // PNG formatında dönüştür
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const fileName = file.name.replace(/\.(jpg|jpeg)$/i, '.png');
                
                showSuccess(resultDiv, url, fileName, 'PNG');
            }, 'image/png');
        };
        
        img.onerror = function() {
            showError(resultDiv, 'Resim yüklenirken hata oluştu.');
        };
        
        img.src = e.target.result;
    };
    
    reader.onerror = function() {
        showError(resultDiv, 'Dosya okunurken hata oluştu.');
    };
    
    reader.readAsDataURL(file);
}

// PNG to JPG dönüştürme fonksiyonu
function convertPngToJpg(file, resultDiv) {
    showLoading(resultDiv, 'PNG dosyası JPG formatına dönüştürülüyor...');

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        
        img.onload = function() {
            // Canvas oluştur
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            
            // Beyaz arkaplan
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Resmi çiz
            ctx.drawImage(img, 0, 0);
            
            // JPG formatında dönüştür (kalite: 0.92)
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const fileName = file.name.replace(/\.png$/i, '.jpg');
                
                showSuccess(resultDiv, url, fileName, 'JPG');
            }, 'image/jpeg', 0.92);
        };
        
        img.onerror = function() {
            showError(resultDiv, 'Resim yüklenirken hata oluştu.');
        };
        
        img.src = e.target.result;
    };
    
    reader.onerror = function() {
        showError(resultDiv, 'Dosya okunurken hata oluştu.');
    };
    
    reader.readAsDataURL(file);
}

// Yükleme mesajı göster
function showLoading(resultDiv, message) {
    resultDiv.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

// Başarılı dönüştürme sonucu
function showSuccess(resultDiv, downloadUrl, fileName, format) {
    resultDiv.innerHTML = `
        <div class="success-state">
            <div class="success-icon">✓</div>
            <h3>Dönüştürme Başarılı!</h3>
            <p>Dosyanız ${format} formatına dönüştürüldü.</p>
            <div class="download-section">
                <a href="${downloadUrl}" download="${fileName}" class="btn download-btn">
                    📥 ${fileName} İndir
                </a>
                <button onclick="location.reload()" class="btn btn-secondary">
                    🔄 Yeni Dosya Dönüştür
                </button>
            </div>
            <div class="file-info">
                <small>Dosyayı indirdikten sonra tarayıcı hafızası temizlenecektir.</small>
            </div>
        </div>
    `;
    
    // Temizlik: 30 dakika sonra URL'yi serbest bırak
    setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
    }, 30 * 60 * 1000);
}

// Hata mesajı göster
function showError(resultDiv, message) {
    resultDiv.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Hata Oluştu</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.remove()" class="btn btn-secondary">
                Tekrar Dene
            </button>
        </div>
    `;
}