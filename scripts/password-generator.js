// Şifre Oluşturucu
function initializePasswordGenerator() {
    const form = document.getElementById('passwordGeneratorForm');
    const resultDiv = document.getElementById('passwordResult');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generatePassword(resultDiv);
    });

    // Input değişikliklerinde anında şifre güncelleme (opsiyonel)
    const inputs = form.querySelectorAll('input[type="number"], input[type="checkbox"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            if (form.dataset.autoUpdate === 'true') {
                generatePassword(resultDiv);
            }
        });
    });
}

// Şifre oluşturma fonksiyonu
function generatePassword(resultDiv) {
    const length = parseInt(document.getElementById('passwordLength').value) || 12;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    // Validasyon
    const validation = validateOptions(includeUppercase, includeLowercase, includeNumbers, includeSymbols, length);
    if (!validation.isValid) {
        showPasswordError(resultDiv, validation.message);
        return;
    }

    // Şifre oluştur
    const password = createPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    
    // Güvenlik seviyesini hesapla
    const strength = calculatePasswordStrength(password, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    
    // Sonucu göster
    showPasswordResult(resultDiv, password, strength);
}

// Seçenekleri doğrula
function validateOptions(uppercase, lowercase, numbers, symbols, length) {
    if (length < 8 || length > 32) {
        return { isValid: false, message: 'Şifre uzunluğu 8-32 karakter arasında olmalıdır.' };
    }

    if (!uppercase && !lowercase && !numbers && !symbols) {
        return { isValid: false, message: 'En az bir karakter tipi seçmelisiniz.' };
    }

    return { isValid: true };
}

// Şifre oluştur
function createPassword(length, uppercase, lowercase, numbers, symbols) {
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // Seçilen karakter setlerini birleştir
    let allChars = '';
    const selectedSets = [];

    if (uppercase) {
        allChars += charSets.uppercase;
        selectedSets.push(charSets.uppercase);
    }
    if (lowercase) {
        allChars += charSets.lowercase;
        selectedSets.push(charSets.lowercase);
    }
    if (numbers) {
        allChars += charSets.numbers;
        selectedSets.push(charSets.numbers);
    }
    if (symbols) {
        allChars += charSets.symbols;
        selectedSets.push(charSets.symbols);
    }

    // Her setten en az bir karakter içermesini sağla
    let password = '';
    
    // Her kategoriden en az bir karakter
    selectedSets.forEach(set => {
        password += set[Math.floor(Math.random() * set.length)];
    });

    // Kalan karakterleri rastgele ekle
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Karakterleri karıştır
    return shuffleString(password);
}

// String'i karıştır
function shuffleString(string) {
    const array = string.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Şifre güvenlik seviyesini hesapla
function calculatePasswordStrength(password, uppercase, lowercase, numbers, symbols) {
    let score = 0;
    const length = password.length;

    // Uzunluk puanı
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;

    // Karakter çeşitliliği puanı
    let diversity = 0;
    if (uppercase) diversity++;
    if (lowercase) diversity++;
    if (numbers) diversity++;
    if (symbols) diversity++;

    if (diversity >= 4) score += 3;
    else if (diversity >= 3) score += 2;
    else if (diversity >= 2) score += 1;

    // Güvenlik seviyesi
    if (score >= 4) return { level: 'strong', text: 'Güçlü', color: '#28a745' };
    if (score >= 3) return { level: 'good', text: 'İyi', color: '#ffc107' };
    return { level: 'weak', text: 'Zayıf', color: '#dc3545' };
}

// Şifre sonucunu göster
function showPasswordResult(resultDiv, password, strength) {
    resultDiv.innerHTML = `
        <div class="password-result">
            <div class="password-header">
                <h3>Oluşturulan Şifre</h3>
                <div class="password-strength">
                    <span class="strength-label">Güvenlik:</span>
                    <span class="strength-badge" style="background-color: ${strength.color}">
                        ${strength.text}
                    </span>
                </div>
            </div>
            
            <div class="password-display">
                <input type="text" value="${password}" readonly class="password-field" id="generatedPassword">
                <button class="copy-btn" onclick="copyPassword()" title="Şifreyi Kopyala">
                    📋
                </button>
            </div>
            
            <div class="password-actions">
                <button onclick="generateNewPassword()" class="btn btn-secondary">
                    🔄 Yeni Şifre Oluştur
                </button>
                <button onclick="savePassword('${password}')" class="btn btn-secondary">
                    💾 Şifreyi Kaydet
                </button>
            </div>
            
            <div class="password-tips">
                <h4>🔒 Güvenlik İpuçları:</h4>
                <ul>
                    <li>Şifrenizi kimseyle paylaşmayın</li>
                    <li>Farklı hesaplar için farklı şifreler kullanın</li>
                    <li>Şifrenizi düzenli olarak değiştirin</li>
                    <li>Mümkünse iki faktörlü kimlik doğrulama kullanın</li>
                </ul>
            </div>
            
            <div class="copy-feedback" id="copyFeedback"></div>
        </div>
    `;
}

// Hata mesajı göster
function showPasswordError(resultDiv, message) {
    resultDiv.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Ayarları Kontrol Edin</h3>
            <p>${message}</p>
        </div>
    `;
}

// Şifreyi kopyala
function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    const feedback = document.getElementById('copyFeedback');
    
    passwordField.select();
    passwordField.setSelectionRange(0, 99999);
    
    try {
        navigator.clipboard.writeText(passwordField.value).then(() => {
            showCopyFeedback(feedback, '✅ Şifre panoya kopyalandı!');
        });
    } catch (err) {
        // Fallback for older browsers
        document.execCommand('copy');
        showCopyFeedback(feedback, '✅ Şifre panoya kopyalandı!');
    }
}

// Kopyalama feedback'i göster
function showCopyFeedback(feedback, message) {
    feedback.textContent = message;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Yeni şifre oluştur
function generateNewPassword() {
    const resultDiv = document.getElementById('passwordResult');
    generatePassword(resultDiv);
}

// Şifreyi kaydet (txt dosyası olarak)
function savePassword(password) {
    const blob = new Blob([`Oluşturulan Şifre: ${password}\n\nOluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}\n\n⚠️ BU DOSYAYI GÜVENLİ BİR YERDE SAKLAYIN`], 
        { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sifre-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}