export const applyTheme = (el, mode) => {
    if (!el.themeToggle) return;
    if (mode === 'light') {
        document.body.classList.add('theme-light');
        el.themeToggle.textContent = 'Mode Gelap';
    } else {
        document.body.classList.remove('theme-light');
        el.themeToggle.textContent = 'Mode Terang';
    }
    localStorage.setItem('rp_theme', mode);
};

export const initTheme = (el) => {
    if (!el.themeToggle) return;
    const storedTheme = localStorage.getItem('rp_theme') || 'dark';
    applyTheme(el, storedTheme);
    el.themeToggle.addEventListener('click', () => {
        const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
        applyTheme(el, next);
    });
};
