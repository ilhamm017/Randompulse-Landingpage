export const initSearch = (state, el, fetchProducts) => {
    el.searchInput.addEventListener('input', () => {
        clearTimeout(state.searchTimer);
        state.searchTimer = setTimeout(() => fetchProducts({ reset: true }), 300);
    });
};
