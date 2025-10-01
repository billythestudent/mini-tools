// QR Kod Oluşturucu
function initializeQrGenerator() {
    const resultDiv = document.getElementById('qrGeneratorResult');
    
    // Sayfa yüklendiğinde placeholder göster
    showQrPlaceholder(resultDiv);

    const form = document.getElementById('qrGeneratorForm');
    const qrText = document.getElementById('qrText');
    const qrSize = document.getElementById('qrSize');
    const qrColor = document.getElementById('qrColor');
    const qrBgColor = document.getElementById('qrBgColor');
    const qrSizeValue = document.getElementById('qrSizeValue');

    // Boyut değerini güncelle
    if (qrSizeValue) {
        qrSizeValue.textContent = `${qrSize.value}px`;
        qrSize.addEventListener('input', function() {
            qrSizeValue.textContent = `${this.value}px`;
        });
    }

    // Real-time QR kod güncelleme
    [qrText, qrSize, qrColor, qrBgColor].forEach(input => {
        input.addEventListener('input', debounce(() => {
            if (qrText.value.trim()) {
                generateQRCode();
            }
        }, 800));
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateQRCode();
    });
}

// QR Kodu oluştur
function generateQRCode() {
    const qrText = document.getElementById('qrText').value.trim();
    const qrSize = parseInt(document.getElementById('qrSize').value) || 200;
    const qrColor = document.getElementById('qrColor').value;
    const qrBgColor = document.getElementById('qrBgColor').value;
    const resultDiv = document.getElementById('qrGeneratorResult');

    if (!qrText) {
        showQrError(resultDiv, 'Lütfen QR kod için içerik girin.');
        return;
    }

    showQrLoading(resultDiv);

    // Hemen QR kod oluştur
    try {
        const qrCodeUrl = createQRCodeUrl(qrText, qrSize, qrColor, qrBgColor);
        showQrResult(resultDiv, qrCodeUrl, qrText, qrSize);
    } catch (error) {
        showQrError(resultDiv, 'QR kod oluşturulurken hata: ' + error.message);
    }
}

// QR Kod URL'si oluştur
function createQRCodeUrl(text, size, color, bgColor) {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
        size: `${size}x${size}`,
        data: text,
        format: 'png'
    });

    if (color !== '#000000') {
        params.append('color', color.replace('#', ''));
    }
    if (bgColor !== '#ffffff') {
        params.append('bgcolor', bgColor.replace('#', ''));
    }

    return baseUrl + '?' + params.toString();
}

// Alternatif QR kod oluşturucu (fallback)
function createQRCodeUrlFallback(text, size, color, bgColor) {
    return `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=${size}&dark=${color.replace('#', '')}&light=${bgColor.replace('#', '')}`;
}

// Yükleme göster
function showQrLoading(resultDiv) {
    resultDiv.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>QR kodu oluşturuluyor...</p>
        </div>
    `;
}

// Placeholder göster
function showQrPlaceholder(resultDiv) {
    resultDiv.innerHTML = `
        <div class="qr-placeholder">
            <div class="placeholder-icon">📱</div>
            <h3>QR Kod Oluşturucu</h3>
            <p>Metin, URL, telefon veya e-posta adresinizi girin ve QR kodunu anında oluşturun.</p>
            <div class="qr-demo-buttons">
                <button onclick="fillExample('url')" class="btn btn-small">🌐 URL Örneği</button>
                <button onclick="fillExample('phone')" class="btn btn-small">📞 Telefon Örneği</button>
                <button onclick="fillExample('email')" class="btn btn-small">📧 E-posta Örneği</button>
            </div>
        </div>
    `;
}

// Örnek doldurma
function fillExample(type) {
    const examples = {
        url: 'https://github.com',
        phone: '+901234567890',
        email: 'ornek@email.com',
        text: 'Merhaba! Bu bir test mesajıdır.'
    };
    
    document.getElementById('qrText').value = examples[type] || examples.text;
    document.getElementById('qrText').focus();
    generateQRCode();
}

// Sonuç göster
function showQrResult(resultDiv, qrCodeUrl, content, size) {
    const fileName = `qrcode-${Date.now()}.png`;
    
    resultDiv.innerHTML = `
        <div class="qr-result">
            <div class="result-header">
                <h3>✅ QR Kodunuz Hazır!</h3>
                <div class="qr-content-preview">
                    <strong>İçerik:</strong> 
                    <span class="content-text" title="${content}">${truncateText(content, 50)}</span>
                </div>
            </div>
            
            <div class="qr-display">
                <div class="qr-image-container">
                    <img src="${qrCodeUrl}" alt="QR Code" class="qr-image" 
                         onload="this.style.opacity='1'">
                    <div class="qr-overlay">
                        <button onclick="downloadQRCode('${qrCodeUrl}', '${fileName}')" class="btn download-qr-btn">
                            📥 PNG İndir
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="qr-actions">
                <button onclick="resetQRGenerator()" class="btn btn-secondary">
                    🔄 Yeni QR Kod
                </button>
                <button onclick="shareQRCode('${content}')" class="btn btn-secondary">
                    📤 Paylaş
                </button>
                <button onclick="testQRCode()" class="btn btn-secondary">
                    🔍 Test Et
                </button>
            </div>
            
            <div class="qr-tips">
                <h4>💡 QR Kod İpuçları:</h4>
                <ul>
                    <li>QR kodu taramak için telefon kamerasını veya QR okuyucu uygulama kullanın</li>
                    <li>Yazdırmak için en az <strong>${Math.max(100, size)}x${Math.max(100, size)}px</strong> boyutunda kullanın</li>
                    <li>Koyu arkaplanlarda açık renk QR kodlar kullanın</li>
                </ul>
            </div>
        </div>
    `;
}

// Hata göster
function showQrError(resultDiv, message) {
    resultDiv.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>QR Kod Oluşturulamadı</h3>
            <p>${message}</p>
            <div class="error-actions">
                <button onclick="generateQRCode()" class="btn btn-secondary">
                    🔄 Tekrar Dene
                </button>
                <button onclick="useFallbackAPI()" class="btn btn-small">
                    Alternatif API Kullan
                </button>
            </div>
        </div>
    `;
}

// Alternatif API kullan
function useFallbackAPI() {
    const qrText = document.getElementById('qrText').value.trim();
    const qrSize = parseInt(document.getElementById('qrSize').value) || 200;
    const qrColor = document.getElementById('qrColor').value;
    const qrBgColor = document.getElementById('qrBgColor').value;
    const resultDiv = document.getElementById('qrGeneratorResult');
    
    try {
        const qrCodeUrl = createQRCodeUrlFallback(qrText, qrSize, qrColor, qrBgColor);
        showQrResult(resultDiv, qrCodeUrl, qrText, qrSize);
    } catch (error) {
        showQrError(resultDiv, 'Alternatif API de çalışmadı: ' + error.message);
    }
}

// QR kod test etme
function testQRCode() {
    const qrText = document.getElementById('qrText').value.trim();
    if (qrText.startsWith('http')) {
        window.open(qrText, '_blank');
    } else if (qrText.startsWith('mailto:')) {
        window.location.href = qrText;
    } else if (qrText.startsWith('tel:')) {
        window.location.href = qrText;
    } else {
        alert('İçerik: ' + qrText);
    }
}

// QR kod paylaşma
function shareQRCode(content) {
    if (navigator.share) {
        navigator.share({
            title: 'QR Kod İçeriği',
            text: content,
            url: window.location.href
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(content).then(() => {
            alert('İçerik panoya kopyalandı: ' + content);
        });
    }
}

// QR kod indirme
function downloadQRCode(url, fileName) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
        })
        .catch(error => {
            console.error('İndirme hatası:', error);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
}

// Sıfırlama
function resetQRGenerator() {
    document.getElementById('qrText').value = '';
    document.getElementById('qrSize').value = '200';
    document.getElementById('qrColor').value = '#000000';
    document.getElementById('qrBgColor').value = '#ffffff';
    
    const resultDiv = document.getElementById('qrGeneratorResult');
    showQrPlaceholder(resultDiv);
}

// Yardımcı fonksiyonlar
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}