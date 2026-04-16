function applyLanguage(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update switcher active state
    const menuItems = document.querySelectorAll('.lang-menu li');
    menuItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-value') === lang);
    });

    // Translate elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[lang];
        
        keys.forEach(k => {
            if (translation) translation = translation[k];
        });

        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else if (el.tagName === 'IMG') {
                el.alt = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });

    // Update document title if data-i18n-title exists
    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl) {
        const key = titleEl.getAttribute('data-i18n-title');
        const keys = key.split('.');
        let translation = translations[lang];
        keys.forEach(k => {
            if (translation) translation = translation[k];
        });
        if (translation) document.title = translation;
    }
}

function setLanguage(lang) {
    localStorage.setItem('portfolio_lang', lang);
    applyLanguage(lang);
}

// 🌐 언어 전환기 주입 (드롭다운 스타일)
function injectLanguageSwitcher() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer || document.querySelector('.lang-dropdown')) return;

    const currentLang = localStorage.getItem('portfolio_lang') || 'ko';
    
    const switcher = document.createElement('div');
    switcher.className = 'lang-dropdown';
    switcher.innerHTML = `
        <button class="lang-trigger" id="langTrigger">
            <i class="fa-solid fa-globe"></i>
            <i class="fa-solid fa-chevron-down"></i>
        </button>
        <ul class="lang-menu" id="langMenu">
            <li data-value="ko" class="${currentLang === 'ko' ? 'active' : ''}">한국어</li>
            <li data-value="en" class="${currentLang === 'en' ? 'active' : ''}">English</li>
        </ul>
    `;

    navContainer.appendChild(switcher);

    const trigger = document.getElementById('langTrigger');
    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        switcher.classList.toggle('active');
    });

    const menuItems = switcher.querySelectorAll('.lang-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.getAttribute('data-value');
            setLanguage(lang);
            switcher.classList.remove('active');
        });
    });

    document.addEventListener('click', () => {
        switcher.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectLanguageSwitcher();
    const currentLang = localStorage.getItem('portfolio_lang') || 'ko';
    applyLanguage(currentLang);
});
