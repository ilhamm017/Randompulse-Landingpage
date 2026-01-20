import { showOverviewView, showListView, showAddView } from './views.js';
import { addImageRow, handleDelete, handleEdit, initCancel } from './form.js';

export const initTabs = (el) => {
    if (el.tabOverview) el.tabOverview.addEventListener('click', () => showOverviewView(el));
    if (el.tabList) el.tabList.addEventListener('click', () => showListView(el));
    if (el.tabAdd) el.tabAdd.addEventListener('click', () => showAddView(el));
};

export const initSearch = (state, el, fetchProducts, renderList, renderPager) => {
    if (!el.searchInput) return;
    el.searchInput.addEventListener('input', () => {
        clearTimeout(state.searchTimer);
        state.searchTimer = setTimeout(() => {
            state.page = 1;
            fetchProducts().then(() => {
                renderList(state, el);
                renderPager(state, el);
            });
        }, 300);
    });
};

export const initPager = (state, el, fetchProducts, renderList, renderPager) => {
    if (!el.pager) return;
    el.pager.addEventListener('click', (event) => {
        const nextBtn = event.target.closest('[data-next]');
        if (nextBtn) {
            state.page += 1;
            fetchProducts().then(() => {
                renderList(state, el);
                renderPager(state, el);
            });
            return;
        }
        const prevBtn = event.target.closest('[data-prev]');
        if (prevBtn) {
            state.page = Math.max(1, state.page - 1);
            fetchProducts().then(() => {
                renderList(state, el);
                renderPager(state, el);
            });
            return;
        }
        const firstBtn = event.target.closest('[data-first]');
        if (firstBtn) {
            state.page = 1;
            fetchProducts().then(() => {
                renderList(state, el);
                renderPager(state, el);
            });
            return;
        }
        const btn = event.target.closest('[data-page]');
        if (!btn) return;
        const nextPage = Number(btn.dataset.page);
        if (!Number.isFinite(nextPage) || nextPage === state.page) return;
        state.page = nextPage;
        fetchProducts().then(() => {
            renderList(state, el);
            renderPager(state, el);
        });
    });
};

export const initListActions = (state, el, placeholderSvg, fetchProducts, renderList, renderPager) => {
    el.list.addEventListener('click', (event) => {
        const actionBtn = event.target.closest('[data-action]');
        if (!actionBtn) return;
        const id = actionBtn.dataset.id;
        if (!id) return;
        if (actionBtn.dataset.action === 'edit') {
            const product = state.adminProducts.find((item) => item.id === id);
            handleEdit(state, el, placeholderSvg, product);
            return;
        }
        if (actionBtn.dataset.action === 'delete') {
            handleDelete(state, el, id, fetchProducts, renderList, renderPager, placeholderSvg);
        }
    });
};

export const initAddImage = (el, placeholderSvg) => {
    if (el.addImageBtn) el.addImageBtn.addEventListener('click', () => addImageRow(el, placeholderSvg));
};

export const initCancelEdit = (state, el, placeholderSvg) => {
    initCancel(state, el, placeholderSvg);
};
