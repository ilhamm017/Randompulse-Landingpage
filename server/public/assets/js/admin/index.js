import { el, state, placeholderSvg } from './state.js';
import { fetchProducts } from './api.js';
import { renderList, renderPager } from './render.js';
import { initFormSubmit, initImagePreview } from './form.js';
import { initTabs, initSearch, initPager, initListActions, initAddImage, initCancelEdit } from './events.js';
import { showOverviewView } from './views.js';

const init = () => {
    if (!el.form || !el.list) return;
    initTabs(el);
    initSearch(state, el, () => fetchProducts(state, el), renderList, renderPager);
    initPager(state, el, () => fetchProducts(state, el), renderList, renderPager);
    initListActions(state, el, placeholderSvg, () => fetchProducts(state, el), renderList, renderPager);
    initAddImage(el, placeholderSvg);
    initCancelEdit(state, el, placeholderSvg);
    initImagePreview(placeholderSvg);
    initFormSubmit(state, el, placeholderSvg, () => fetchProducts(state, el), renderList, renderPager);

    fetchProducts(state, el).then(() => {
        renderList(state, el);
        renderPager(state, el);
    });
    showOverviewView(el);
};

document.addEventListener('DOMContentLoaded', init);
