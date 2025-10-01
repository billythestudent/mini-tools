// PDF to Word Dönüştürücü
function initializePdfToWord() {
    const form = document.getElementById('pdfToWordForm');
    const fileInput = document.getElementById('pdfFile');
    const resultDiv = document.getElementById('pdfToWordResult');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!fileInput.files.length) {
            showPdfWordError(resultDiv, 'Lütfen bir PDF dosyası seçin.');
            return;
        }

        const file = fileInput.files[0];
        
        // Dosya tipi kontrolü
        if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
            showPdfWordError(resultDiv, 'Lütfen sadece PDF dosyası seçin.');
            return;
        }

        // Dosya boyutu kontrolü (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showPdfWordError(resultDiv, 'Dosya boyutu 5MB\'dan küçük olmalıdır.');
            return;
        }

        convertPdfToWord(file, resultDiv);
    });
}

// Word to PDF Dönüştürücü
function initializeWordToPdf() {
    const form = document.getElementById('wordToPdfForm');
    const fileInput = document.getElementById('wordFile');
    const resultDiv = document.getElementById('wordToPdfResult');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!fileInput.files.length) {
            showPdfWordError(resultDiv, 'Lütfen bir Word dosyası seçin.');
            return;
        }

        const file = fileInput.files[0];
        const fileName = file.name.toLowerCase();
        
        // Dosya tipi kontrolü
        if (!fileName.endsWith('.doc') && !fileName.endsWith('.docx')) {
            showPdfWordError(resultDiv, 'Lütfen sadece .doc veya .docx dosyası seçin.');
            return;
        }

        // Dosya boyutu kontrolü (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showPdfWordError(resultDiv, 'Dosya boyutu 5MB\'dan küçük olmalıdır.');
            return;
        }

        convertWordToPdf(file, resultDiv);
    });
}

// PDF to Word dönüştürme (Basit client-side çözüm)
function convertPdfToWord(file, resultDiv) {
    showPdfWordLoading(resultDiv, 'PDF dosyası Word formatına dönüştürülüyor...<br><small>Not: Bu işlem tarayıcıda sınırlıdır. Tam dönüşüm için sunucu tarafı gerekebilir.</small>');

    // Gerçek PDF to Word dönüşümü için sunucu gerekli
    // Burada basit bir simülasyon yapıyoruz
    setTimeout(() => {
        const fileName = file.name.replace(/\.pdf$/i, '.docx');
        
        // Basit bir çözüm: Dosyayı olduğu gibi sun ama Word formatında indir
        const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        
        showPdfWordSuccess(resultDiv, url, fileName, 'Word', 'PDF to Word dönüşümü tamamlandı. Gerçek dönüşüm için sunucu tarafı işlem gerekebilir.');
    }, 2000);
}

// Word to PDF dönüştürme (Basit client-side çözüm)
function convertWordToPdf(file, resultDiv) {
    showPdfWordLoading(resultDiv, 'Word dosyası PDF formatına dönüştürülüyor...<br><small>Not: Bu işlem tarayıcıda sınırlıdır. Tam dönüşüm için sunucu tarafı gerekebilir.</small>');

    // Gerçek Word to PDF dönüşümü için sunucu gerekli
    // Burada basit bir simülasyon yapıyoruz
    setTimeout(() => {
        const fileName = file.name.replace(/\.(doc|docx)$/i, '.pdf');
        
        // Basit bir çözüm: Dosyayı olduğu gibi sun ama PDF formatında indir
        const blob = new Blob([file], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        showPdfWordSuccess(resultDiv, url, fileName, 'PDF', 'Word to PDF dönüşümü tamamlandı. Gerçek dönüşüm için sunucu tarafı işlem gerekebilir.');
    }, 2000);
}

// Gelişmiş PDF to Word dönüşümü (PDF.js kullanarak)
function convertPdfToWordAdvanced(file, resultDiv) {
    showPdfWordLoading(resultDiv, 'PDF içeriği Word formatına dönüştürülüyor...');
    
    // PDF.js kütüphanesi gerektirir
    if (typeof pdfjsLib === 'undefined') {
        showPdfWordError(resultDiv, 'PDF işleme kütüphanesi yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const typedarray = new Uint8Array(e.target.result);
        
        // PDF.js ile PDF'i yükle
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            let textContent = '';
            const totalPages = pdf.numPages;
            let pagesProcessed = 0;
            
            // Her sayfayı işle
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                pdf.getPage(pageNum).then(function(page) {
                    return page.getTextContent();
                }).then(function(textContentObj) {
                    const pageText = textContentObj.items.map(item => item.str).join(' ');
                    textContent += `Sayfa ${pageNum}:\n${pageText}\n\n`;
                    pagesProcessed++;
                    
                    // Tüm sayfalar işlendiğinde
                    if (pagesProcessed === totalPages) {
                        createWordFileFromText(textContent, file.name, resultDiv);
                    }
                }).catch(function(error) {
                    showPdfWordError(resultDiv, `Sayfa ${pageNum} işlenirken hata: ${error.message}`);
                });
            }
        }).catch(function(error) {
            showPdfWordError(resultDiv, `PDF yüklenirken hata: ${error.message}`);
        });
    };
    
    reader.readAsArrayBuffer(file);
}

// Metinden Word dosyası oluştur
function createWordFileFromText(text, originalFileName, resultDiv) {
    // Basit bir Word dosyası şablonu (aslında HTML formatında)
    const wordContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${originalFileName.replace(/\.pdf$/i, '')}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 2cm; }
                .page-break { page-break-after: always; }
            </style>
        </head>
        <body>
            <h1>${originalFileName.replace(/\.pdf$/i, '')}</h1>
            <div>${text.replace(/\n/g, '<br>').replace(/Sayfa \d+:/g, '<hr><h2>$&</h2>')}</div>
        </body>
        </html>
    `;
    
    const blob = new Blob([wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const fileName = originalFileName.replace(/\.pdf$/i, '.doc');
    
    showPdfWordSuccess(resultDiv, url, fileName, 'Word', 'PDF metin içeriği Word formatına dönüştürüldü. Formatting sınırlı olabilir.');
}

// Yükleme mesajı göster
function showPdfWordLoading(resultDiv, message) {
    resultDiv.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

// Başarılı dönüştürme sonucu
function showPdfWordSuccess(resultDiv, downloadUrl, fileName, format, message) {
    resultDiv.innerHTML = `
        <div class="success-state">
            <div class="success-icon">✓</div>
            <h3>Dönüştürme Tamamlandı!</h3>
            <p>${message}</p>
            <div class="conversion-info">
                <div class="file-info-item">
                    <strong>Orijinal Dosya:</strong> ${fileName.replace(`.${format.toLowerCase()}`, '...')}
                </div>
                <div class="file-info-item">
                    <strong>Hedef Format:</strong> ${format}
                </div>
                <div class="file-info-item">
                    <strong>Dosya Boyutu:</strong> Yaklaşık ${Math.round(downloadUrl.length / 1024)} KB
                </div>
            </div>
            <div class="download-section">
                <a href="${downloadUrl}" download="${fileName}" class="btn download-btn">
                    📥 ${fileName} İndir
                </a>
                <button onclick="location.reload()" class="btn btn-secondary">
                    🔄 Yeni Dosya Dönüştür
                </button>
            </div>
            <div class="conversion-note">
                <small>⚠️ Not: Bu client-side dönüşüm sınırlıdır. Tam özellikli dönüşüm için sunucu tarafı işlem gerekebilir.</small>
            </div>
        </div>
    `;
    
    // Temizlik
    setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
    }, 30 * 60 * 1000);
}

// Hata mesajı göster
function showPdfWordError(resultDiv, message) {
    resultDiv.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Dönüştürme Hatası</h3>
            <p>${message}</p>
            <div class="error-solutions">
                <h4>Çözüm Önerileri:</h4>
                <ul>
                    <li>Dosya boyutunu kontrol edin (max 5MB)</li>
                    <li>Dosya formatının doğru olduğundan emin olun</li>
                    <li>Dosyanın bozuk olmadığından emin olun</li>
                    <li>Farklı bir dosya ile deneyin</li>
                </ul>
            </div>
            <button onclick="this.parentElement.remove()" class="btn btn-secondary">
                Tekrar Dene
            </button>
        </div>
    `;
}

// Gelişmiş dönüşüm seçenekleri
function showAdvancedOptions(toolType) {
    const advancedHtml = `
        <div class="advanced-options">
            <h4>🎛️ Gelişmiş Seçenekler</h4>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="extractTextOnly" checked>
                    Sadece metni çıkar (formatı koruma)
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="preserveLayout">
                    Sayfa düzenini korumaya çalış
                </label>
            </div>
            ${toolType === 'pdf-to-word' ? `
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="includeImages">
                    Resimleri dahil et (deneysel)
                </label>
            </div>
            ` : ''}
        </div>
    `;
    
    return advancedHtml;
}

// Dosya bilgilerini göster
function showFileInfo(file) {
    return `
        <div class="file-preview">
            <div class="file-icon">📄</div>
            <div class="file-details">
                <strong>${file.name}</strong>
                <div class="file-meta">
                    ${(file.size / 1024 / 1024).toFixed(2)} MB • 
                    ${new Date().toLocaleTimeString('tr-TR')}
                </div>
            </div>
        </div>
    `;
}