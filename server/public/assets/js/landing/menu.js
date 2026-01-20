export const initMenu = (el) => {
    if (!el.menuToggle) return;
    el.menuToggle.addEventListener('click', () => {
        const isOpen = !el.menuItems.classList.contains('hidden');
        el.menuItems.classList.toggle('hidden');
        el.menuToggle.setAttribute('aria-expanded', String(!isOpen));
        el.menuChevron.textContent = isOpen ? '>' : 'v';
    });
};
