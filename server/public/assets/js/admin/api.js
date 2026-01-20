export const fetchProducts = async (state, el) => {
    if (state.isLoading) return;
    state.isLoading = true;
    const term = (el.searchInput?.value || '').trim();
    const params = new URLSearchParams({ page: String(state.page), limit: String(state.limit) });
    if (term) params.set('q', term);
    const res = await fetch(`/api/products?${params.toString()}`);
    const json = await res.json();
    state.adminProducts = json.items || [];
    state.total = json.total || 0;
    state.isLoading = false;
    if (el.statTotal) el.statTotal.textContent = String(state.total);
    return state.adminProducts;
};
