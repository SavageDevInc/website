const audio = document.getElementById('bg-music');
const musicWrapper = document.getElementById('musicPlayer');
const autoplayGate = document.getElementById('autoplay-gate');
let isMusicInitialized = false;

// AI Asistanı Elementleri
const aiPanel = document.getElementById('aiPanel');
const chatMessages = document.getElementById('chatMessages');
const aiInput = document.getElementById('aiInput');

// --- 1. AÇILIŞ ve AUTOPLAY GATE ---
window.addEventListener('load', () => {
    // İlk açılışta Home'u aktif yap
    document.querySelector('nav a[href="#home"]').classList.add('active'); 

    setTimeout(() => { 
        document.body.classList.add('loaded'); 
        observe(); 
        autoplayGate.style.display = 'flex'; 
    }, 1500);
});

function startExperience() {
    if (isMusicInitialized) return;

    audio.load();
    audio.volume = 0.3; 
    
    // Otomatik oynatmayı dene
    audio.play().then(() => {
        isMusicInitialized = true;
        musicWrapper.classList.remove('music-paused');
        musicWrapper.classList.add('active');
    }).catch(error => {
        isMusicInitialized = true; 
    });

    document.body.classList.add('started');
    autoplayGate.style.display = 'none';
}


// --- 2. GÜVENLİK ---
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = e => { if(e.key == "F12" || (e.ctrlKey && e.shiftKey && e.key == "I")) return false; };

// --- 3. ATMOSFERİK MOUSE TAKİBİ (Sadece PC'de Aktif) ---
const light = document.getElementById('ambient-light');
const cursor = document.getElementById('cursor-dot');

// Sadece geniş ekranlarda (PC) çalıştır
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        light.style.left = x + 'px';
        light.style.top = y + 'px';
    });

    document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
    document.addEventListener('mouseup', () => document.body.classList.remove('clicking'));
}

// --- 4. AYARLAR ---
function togglePanel() { document.getElementById('settingsPanel').classList.toggle('open'); }

function toggleTheme(btn) {
    document.body.classList.toggle('light-mode');
    const knob = document.getElementById('themeKnob');
    if(document.body.classList.contains('light-mode')) knob.style.transform = "translateX(20px)";
    else knob.style.transform = "translateX(0)";
}

function setColor(theme, btn) {
    document.body.classList.remove('theme-purple', 'theme-cyan', 'theme-gold');
    if(theme) document.body.classList.add(theme);
    document.querySelectorAll('.color-opt').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
}

// --- 5. MÜZİK PLAYER ---
function togglePlay() {
    if(!isMusicInitialized) {
        startExperience();
        return;
    }
    
    if(audio.paused) {
        audio.play();
        musicWrapper.classList.remove('music-paused');
        musicWrapper.classList.add('active');
    } else {
        audio.pause();
        musicWrapper.classList.add('music-paused');
        musicWrapper.classList.remove('active');
    }
}

audio.addEventListener('ended', () => {
     musicWrapper.classList.add('music-paused');
});

// --- 6. AI ASİSTAN MANTIĞI ---
function toggleAIPanel() { 
    aiPanel.classList.toggle('open'); 
}

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    messageDiv.innerText = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; 
}

function sendAIMessage() {
    const text = aiInput.value.trim();
    if (text === "") return;

    appendMessage('user', text);
    aiInput.value = '';

    setTimeout(() => {
        let response = "";
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes("kaç para") || lowerText.includes("fiyat") || lowerText.includes("paket")) {
            response = "Fiyatlarımız STARTER (₺350) ile BRANDING (₺7500) arasında değişiyor. Düzenli içerik üretiyorsanız CREATOR paketimiz en uygunudur. Daha detaylı ne tür bir iş arıyorsunuz?";
        } else if (lowerText.includes("thumbnail") || lowerText.includes("küçük resim")) {
            response = "Thumbnail ihtiyacınız varsa, tek seferlik işler için STARTER (₺350) ya da aylık 10 thumbnail için CREATOR (₺2500) paketlerimizi inceleyebilirsiniz.";
        } else if (lowerText.includes("logo") || lowerText.includes("marka") || lowerText.includes("kimlik")) {
            response = "Tam kapsamlı bir marka kimliği ve logo tasarımı için BRANDING (₺7500) paketi size en uygunudur.";
        } else if (lowerText.includes("merhaba") || lowerText.includes("selam")) {
             response = "Selam! Sana nasıl yardımcı olabilirim? Hangi paket veya tasarım türü hakkında bilgi almak istersin?";
        } else {
            response = "Lütfen ne tür bir tasarım hizmeti (örn: thumbnail, logo, banner) aradığınızı belirtin veya paketler hakkında soru sorun.";
        }
        
        appendMessage('ai', response);
    }, 1000);
}


// --- 7. MODAL & NAVİGASYON KONTROLÜ ---

function openPayment() {
    document.body.classList.add('payment-active');
    window.location.hash = '#payment-modal';
}

function closePayment() {
    document.body.classList.remove('payment-active');
    window.location.hash = '#home';
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    showSection('home');
}

function showSection(targetId) {
    // Nav item active class
    document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
    
    // Eğer hedef "payment" ise scroll yapma
    if (targetId === 'payment') {
        openPayment();
        return;
    }

    document.body.classList.remove('payment-active');
    const targetNav = document.querySelector('nav a[href="#' + targetId + '"]');
    if (targetNav) targetNav.classList.add('active');

    const targetElement = document.getElementById(targetId);
    if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash === 'payment-modal') openPayment();
    else if (hash && hash !== 'payment-modal') showSection(hash);
});

// --- 8. SCROLL REVEAL ---
function observe() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, {threshold: 0.1});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}