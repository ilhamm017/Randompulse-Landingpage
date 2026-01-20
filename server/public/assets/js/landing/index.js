import { state, el } from './state.js';
import { initTheme } from './theme.js';
import { initMenu } from './menu.js';
import { renderGrid, initGallery, initSlider } from './gallery.js';
import { renderPager, initPager } from './pager.js';
import { initSearch } from './search.js';
import { fetchProducts as fetchProductsApi } from './api.js';

const init = () => {
    if (!el.searchInput) return;
    const fetchProducts = (options) => fetchProductsApi(state, el, renderGrid, renderPager, options);
    initTheme(el);
    initMenu(el);
    initSearch(state, el, fetchProducts);
    initPager(state, el, fetchProducts);
    initGallery(state, el);
    initSlider(state, el);
    fetchProducts({ reset: true });
};

document.addEventListener('DOMContentLoaded', init);
