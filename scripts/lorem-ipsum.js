// Lorem Ipsum Generator
function initializeLoremIpsum() {
    const loremHTML = `
        <div class="lorem-container">
            <h2>Lorem Ipsum Generator</h2>
            <p class="tool-description">Profesyonel görünüm için metin yer tutucular oluşturun</p>
            
            <form id="loremForm">
                <div class="lorem-settings">
                    <div class="form-group">
                        <label for="loremType">İçerik Tipi:</label>
                        <select id="loremType">
                            <option value="paragraphs">Paragraf</option>
                            <option value="words">Kelime</option>
                            <option value="sentences">Cümle</option>
                            <option value="lists">Liste</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="loremCount">Miktar:</label>
                        <input type="number" id="loremCount" min="1" max="50" value="3">
                    </div>
                    
                    <div class="form-group">
                        <label for="loremLanguage">Dil:</label>
                        <select id="loremLanguage">
                            <option value="latin">Latin (Klasik)</option>
                            <option value="turkish">Türkçe</option>
                            <option value="english">İngilizce</option>
                            <option value="mixed">Karışık</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="startWithLorem" checked>
                            "Lorem ipsum" ile başlasın
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Lorem Ipsum Oluştur</button>
                    <button type="button" class="btn btn-secondary" onclick="generateLoremIpsum()">Hızlı Üret</button>
                    <button type="button" class="btn btn-secondary" onclick="copyLoremText()">Kopyala</button>
                </div>
            </form>
            
            <div class="lorem-result">
                <div class="result-header">
                    <h3>Oluşturulan Metin</h3>
                    <div class="result-stats">
                        <span id="wordCount">0 kelime</span>
                        <span id="charCount">0 karakter</span>
                    </div>
                </div>
                <div class="lorem-output" id="loremOutput">
                    <div class="placeholder-text">Lorem ipsum oluşturmak için yukarıdaki butona tıklayın...</div>
                </div>
            </div>
            
            <div class="lorem-tips">
                <h4>💡 Kullanım İpuçları:</h4>
                <ul>
                    <li>Tasarım mockup'larında metin yer tutucu olarak kullanın</li>
                    <li>Yazı tipi ve layout testleri için ideal</li>
                    <li>Farklı dillerde içerik üretebilirsiniz</li>
                    <li>Oluşturulan metni tek tıkla kopyalayabilirsiniz</li>
                </ul>
            </div>
        </div>
    `;
    
    // Tool container içine direkt HTML yerleştir
    const toolContainer = document.getElementById('tool-container');
    const loremContent = document.getElementById('loremContent');
    
    if (loremContent) {
        loremContent.innerHTML = loremHTML;
    } else {
        // Eğer loremContent yoksa, toolContainer'a direkt ekle
        toolContainer.innerHTML = loremHTML;
    }
    
    // Form submit event
    const form = document.getElementById('loremForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            generateLoremIpsum();
        });
    }
    
    // Real-time generation on settings change
    const settingsInputs = document.querySelectorAll('#loremType, #loremCount, #loremLanguage, #startWithLorem');
    settingsInputs.forEach(input => {
        input.addEventListener('change', function() {
            const outputElement = document.getElementById('loremOutput');
            if (outputElement && !outputElement.textContent.includes('Lorem ipsum oluşturmak için')) {
                generateLoremIpsum();
            }
        });
    });
    
    // Sayfa yüklendiğinde bir örnek göster
    setTimeout(() => {
        generateLoremIpsum();
    }, 100);
}

// Lorem Ipsum veritabanı
const loremTexts = {
    latin: {
        words: ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat"],
        sentences: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia."
        ]
    },
    turkish: {
        words: ["bir", "ve", "için", "bu", "ile", "olarak", "üzerine", "daha", "çok", "ama", "onun", "ne", "gibi", "ya", "sadece", "kendi", "biz", "onlar", "olmak", "dedi", "o", "var", "dan", "burada", "şey", "sen", "ya da", "sahip", "zaman", "eğer", "onları", "bazı", "olacak", "şimdi", "bulmak", "her", "küçük", "üç", "gitmek", "bilgi", "çalışmak", "hayat", "kitap", "ev", "yazı", "sayı", "su", "yağmur", "güneş"],
        sentences: [
            "Birçok yazar ve tasarımcı bu metni kullanır.",
            "Burada anlamlı içerik yerine metin yerleşimini görebilirsiniz.",
            "Tasarım sürecinde içerik henüz hazır değilken bu metin kullanılır.",
            "Yazı tipi ve punto seçimlerini test etmek için ideal bir araçtır.",
            "Profesyonel görünüm için lorem ipsum metinleri tercih edilir."
        ]
    },
    english: {
        words: ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "hello", "world", "this", "is", "sample", "text", "for", "testing", "purposes", "web", "development", "design", "layout", "typography", "content", "placeholder", "generator", "useful", "tool", "create", "beautiful", "interfaces"],
        sentences: [
            "The quick brown fox jumps over the lazy dog.",
            "Web developers often use placeholder text in their designs.",
            "This tool helps create realistic looking content for mockups.",
            "Typography testing requires meaningful looking text samples.",
            "User interface design benefits from proper text placement."
        ]
    }
};

// Karışık dil için kelimeleri birleştir
loremTexts.mixed = {
    words: [...loremTexts.latin.words, ...loremTexts.turkish.words, ...loremTexts.english.words],
    sentences: [...loremTexts.latin.sentences, ...loremTexts.turkish.sentences, ...loremTexts.english.sentences]
};

function generateLoremIpsum() {
    const type = document.getElementById('loremType')?.value || 'paragraphs';
    const count = parseInt(document.getElementById('loremCount')?.value || '3');
    const language = document.getElementById('loremLanguage')?.value || 'latin';
    const startWithLorem = document.getElementById('startWithLorem')?.checked || true;
    
    let output = '';
    
    switch(type) {
        case 'paragraphs':
            output = generateParagraphs(count, language, startWithLorem);
            break;
        case 'words':
            output = generateWords(count, language);
            break;
        case 'sentences':
            output = generateSentences(count, language);
            break;
        case 'lists':
            output = generateList(count, language);
            break;
    }
    
    displayLoremOutput(output);
    updateStats(output);
}

function generateParagraphs(count, language, startWithLorem) {
    const paragraphs = [];
    const words = loremTexts[language]?.words || loremTexts.latin.words;
    const sentences = loremTexts[language]?.sentences || loremTexts.latin.sentences;
    
    for (let i = 0; i < count; i++) {
        let paragraph = '';
        const sentenceCount = getRandomInt(3, 8);
        
        if (i === 0 && startWithLorem && language === 'latin') {
            paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        }
        
        for (let j = 0; j < sentenceCount; j++) {
            if (language === 'latin' && i === 0 && j === 0 && startWithLorem) {
                continue;
            }
            
            if (Math.random() > 0.3 && sentences.length > 0) {
                paragraph += sentences[Math.floor(Math.random() * sentences.length)] + ' ';
            } else {
                paragraph += generateRandomSentence(words, language) + ' ';
            }
        }
        
        paragraphs.push(`<p>${paragraph.trim()}</p>`);
    }
    
    return paragraphs.join('\n');
}

function generateWords(count, language) {
    const words = loremTexts[language]?.words || loremTexts.latin.words;
    const result = [];
    
    for (let i = 0; i < count; i++) {
        result.push(words[Math.floor(Math.random() * words.length)]);
    }
    
    return result.join(' ');
}

function generateSentences(count, language) {
    const words = loremTexts[language]?.words || loremTexts.latin.words;
    const sentences = [];
    
    for (let i = 0; i < count; i++) {
        if (Math.random() > 0.4 && loremTexts[language]?.sentences?.length > 0) {
            sentences.push(loremTexts[language].sentences[Math.floor(Math.random() * loremTexts[language].sentences.length)]);
        } else {
            sentences.push(generateRandomSentence(words, language));
        }
    }
    
    return sentences.map(sentence => `<p>${sentence}</p>`).join('\n');
}

function generateList(count, language) {
    const words = loremTexts[language]?.words || loremTexts.latin.words;
    const items = [];
    
    for (let i = 0; i < count; i++) {
        const wordCount = getRandomInt(3, 8);
        let item = '';
        
        for (let j = 0; j < wordCount; j++) {
            item += words[Math.floor(Math.random() * words.length)] + ' ';
        }
        
        items.push(`<li>${item.trim()}</li>`);
    }
    
    return `<ul>${items.join('')}</ul>`;
}

function generateRandomSentence(words, language) {
    const wordCount = getRandomInt(5, 15);
    const sentenceWords = [];
    
    for (let i = 0; i < wordCount; i++) {
        sentenceWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    
    let sentence = sentenceWords.join(' ');
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    
    return sentence;
}

function displayLoremOutput(text) {
    const outputElement = document.getElementById('loremOutput');
    if (outputElement) {
        outputElement.innerHTML = text;
        outputElement.classList.add('fade-in');
        
        setTimeout(() => {
            outputElement.classList.remove('fade-in');
        }, 500);
    }
}

function updateStats(text) {
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const characters = cleanText.replace(/\s/g, '').length;
    
    const wordCountElement = document.getElementById('wordCount');
    const charCountElement = document.getElementById('charCount');
    
    if (wordCountElement) wordCountElement.textContent = `${words.length} kelime`;
    if (charCountElement) charCountElement.textContent = `${characters} karakter`;
}

function copyLoremText() {
    const outputElement = document.getElementById('loremOutput');
    if (!outputElement) return;
    
    const textToCopy = outputElement.textContent || outputElement.innerText;
    
    if (!textToCopy || textToCopy.includes('Lorem ipsum oluşturmak için')) {
        showCopyMessage('Kopyalanacak metin yok!', 'error');
        return;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyMessage('Metin panoya kopyalandı! 📋', 'success');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyMessage('Metin panoya kopyalandı! 📋', 'success');
    });
}

function showCopyMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `copy-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// CSS Animations için style ekle (sadece bir kere ekle)
if (!document.querySelector('#lorem-styles')) {
    const style = document.createElement('style');
    style.id = 'lorem-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}