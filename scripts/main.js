// Tool container element
const toolContainer = document.getElementById('tool-container');
const toolCards = document.querySelectorAll('.tool-card');

// Tool templates
const toolTemplates = {
    'jpg-to-png': `
        <div class="tool-container">
            <h2>JPG to PNG Dönüştürücü</h2>
            <form id="jpgToPngForm">
                <div class="form-group">
                    <label for="jpgFile">JPG Dosyası Seçin:</label>
                    <input type="file" id="jpgFile" accept=".jpg,.jpeg" required>
                </div>
                <button type="submit" class="btn btn-primary">PNG'ye Dönüştür</button>
            </form>
            <div id="jpgToPngResult"></div>
        </div>
    `,
    
    'png-to-jpg': `
        <div class="tool-container">
            <h2>PNG to JPG Dönüştürücü</h2>
            <form id="pngToJpgForm">
                <div class="form-group">
                    <label for="pngFile">PNG Dosyası Seçin:</label>
                    <input type="file" id="pngFile" accept=".png" required>
                </div>
                <button type="submit" class="btn btn-primary">JPG'ye Dönüştür</button>
            </form>
            <div id="pngToJpgResult"></div>
        </div>
    `,
    
    'pdf-to-word': `
        <div class="tool-container">
            <h2>PDF to Word Dönüştürücü</h2>
            <form id="pdfToWordForm">
                <div class="form-group">
                    <label for="pdfFile">PDF Dosyası Seçin:</label>
                    <input type="file" id="pdfFile" accept=".pdf" required>
                </div>
                <button type="submit" class="btn btn-primary">Word'e Dönüştür</button>
            </form>
            <div id="pdfToWordResult"></div>
        </div>
    `,
    
    'word-to-pdf': `
        <div class="tool-container">
            <h2>Word to PDF Dönüştürücü</h2>
            <form id="wordToPdfForm">
                <div class="form-group">
                    <label for="wordFile">Word Dosyası Seçin (.doc, .docx):</label>
                    <input type="file" id="wordFile" accept=".doc,.docx" required>
                </div>
                <button type="submit" class="btn btn-primary">PDF'e Dönüştür</button>
            </form>
            <div id="wordToPdfResult"></div>
        </div>
    `,
    
    'password-generator': `
        <div class="tool-container">
            <h2>Şifre Oluşturucu</h2>
            <form id="passwordGeneratorForm">
                <div class="form-group">
                    <label for="passwordLength">Şifre Uzunluğu:</label>
                    <input type="number" id="passwordLength" min="8" max="32" value="12">
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="includeUppercase" checked>
                        Büyük Harf Kullan (A-Z)
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="includeLowercase" checked>
                        Küçük Harf Kullan (a-z)
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="includeNumbers" checked>
                        Rakam Kullan (0-9)
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="includeSymbols">
                        Sembol Kullan (!@#$%^&*)
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">Şifre Oluştur</button>
            </form>
            <div id="passwordResult"></div>
        </div>
    `,

    'qr-generator': `
        <div class="tool-container">
            <h2>QR Kod Oluşturucu</h2>
            <form id="qrGeneratorForm">
                <div class="form-group">
                    <label for="qrText">QR Kod İçeriği:</label>
                    <textarea id="qrText" placeholder="URL, metin, telefon, e-posta girin..." rows="3"></textarea>
                    <small class="input-hint">Örnek: https://example.com, +901234567890, email@example.com</small>
                </div>
                
                <div class="qr-settings">
                    <div class="form-group">
                        <label for="qrSize">Boyut: <span id="qrSizeValue">200px</span></label>
                        <input type="range" id="qrSize" min="100" max="500" value="200" step="50">
                    </div>
                    
                    <div class="color-settings">
                        <div class="form-group">
                            <label for="qrColor">QR Rengi:</label>
                            <input type="color" id="qrColor" value="#000000">
                        </div>
                        
                        <div class="form-group">
                            <label for="qrBgColor">Arkaplan:</label>
                            <input type="color" id="qrBgColor" value="#ffffff">
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">QR Kod Oluştur</button>
                    <button type="button" onclick="resetQRGenerator()" class="btn btn-secondary">Temizle</button>
                </div>
            </form>
            <div id="qrGeneratorResult"></div>
        </div>
    `,

    'calendar': `
        <div class="tool-container">
            <div id="calendarContent"></div>
        </div>
    `,

    'lorem-ipsum': `
        <div class="tool-container">
            <div id="loremContent"></div>
        </div>
    `
};

// Event listeners for tool cards
toolCards.forEach(card => {
    card.addEventListener('click', () => {
        const toolType = card.dataset.tool;
        loadTool(toolType);
    });
});

// Load selected tool
function loadTool(toolType) {
    if (toolTemplates[toolType]) {
        toolContainer.innerHTML = toolTemplates[toolType];
        initializeTool(toolType);
        
        // Scroll to tool container
        toolContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize tool functionality
function initializeTool(toolType) {
    switch(toolType) {
        case 'jpg-to-png':
            initializeJpgToPng();
            break;
        case 'png-to-jpg':
            initializePngToJpg();
            break;
        case 'pdf-to-word':
            initializePdfToWord();
            break;
        case 'word-to-pdf':
            initializeWordToPdf();
            break;
        case 'password-generator':
            initializePasswordGenerator();
            break;
        case 'qr-generator':
            initializeQrGenerator();
            break;
        case 'calendar':
            initializeCalendar();
            break;
        case 'lorem-ipsum':
            initializeLoremIpsum();
            break;
        case 'gradient-generator':
            initializeGradientGenerator();
            break;
    }
}

// Sayfa yüklendiğinde auth state kontrol et
document.addEventListener('DOMContentLoaded', function() {
    // Auth sistemi varsa kontrol et
    if (typeof auth !== 'undefined') {
        auth.checkAuthState();
    }
});