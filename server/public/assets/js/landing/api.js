export const fetchProducts = async (state, el, renderGrid, renderPager, { reset = false } = {}) => {
    if (state.isLoading) return;
    state.isLoading = true;
    el.loadState.textContent = 'Memuat data...';
    el.loadState.classList.remove('hidden');
    el.pager.classList.add('hidden');

    if (reset) {
        state.page = 1;
        state.products = [];
        renderGrid(state, el, []);
    }

    try {
        const q = el.searchInput.value.trim();
        const params = new URLSearchParams({
            page: String(state.page),
            limit: String(state.limit)
        });
        if (q) params.set('q', q);
        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        const items = (json.items || []).map((item) => ({
            id: item.id,
            number: item.productNumber,
            title: item.name || '',
            price: item.price || '',
            tag: 'Produk',
            images: Array.isArray(item.images) && item.images.length
                ? item.images
                : (item.image ? [item.image] : []),
            image: item.image || 'https://placehold.co/400x400/eee/333?text=No+Image',
            description: item.description || '',
            link: item.link || '#'
        }));
        state.total = json.total || 0;
        state.products = reset ? items : state.products.concat(items);
        renderGrid(state, el, items, { append: false });
        if (state.total > 0) {
            el.loadState.classList.add('hidden');
        } else {
            el.loadState.textContent = 'Tidak ada hasil.';
        }
        renderPager(state, el);
        el.pager.classList.remove('hidden');
    } catch (error) {
        el.loadState.textContent = 'Gagal memuat data.';
    } finally {
        state.isLoading = false;
    }
};
