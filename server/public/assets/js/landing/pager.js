export const renderPager = (state, el) => {
    const totalPages = Math.ceil(state.total / state.limit);
    if (!totalPages) {
        el.pager.innerHTML = '';
        return;
    }
    const buttons = [];
    const lastPage = totalPages;
    const windowSize = 7;
    let start = Math.max(2, state.page - Math.floor(windowSize / 2));
    let end = Math.min(lastPage - 1, start + windowSize - 1);
    start = Math.max(2, end - windowSize + 1);

    if (state.page > 1) {
        buttons.push(`
            <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold bg-slate-200 text-slate-900"
                data-first="true">
                First
            </button>
            <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold bg-slate-200 text-slate-900"
                data-prev="true">
                Prev
            </button>
        `);
    }

    const isFirstActive = state.page === 1;
    buttons.push(`
        <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold ${isFirstActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-900'}"
            data-page="1">
            1
        </button>
    `);

    if (start > 2) {
        buttons.push('<span class="px-2 text-[10px] text-slate-400">...</span>');
    }

    for (let i = start; i <= end; i += 1) {
        const isActive = i === state.page;
        buttons.push(`
            <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-900'}"
                data-page="${i}">
                ${i}
            </button>
        `);
    }

    if (end < lastPage - 1) {
        buttons.push('<span class="px-2 text-[10px] text-slate-400">...</span>');
    }

    if (lastPage > 1) {
        const isLastActive = state.page === lastPage;
        buttons.push(`
            <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold ${isLastActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-900'}"
                data-page="${lastPage}">
                ${lastPage}
            </button>
        `);
    }

    if (state.page < lastPage) {
        buttons.push(`
            <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold bg-slate-200 text-slate-900"
                data-next="true">
                Next
            </button>
        `);
    }

    el.pager.innerHTML = buttons.join('');
};

export const initPager = (state, el, fetchProducts) => {
    el.pager.addEventListener('click', (event) => {
        const nextBtn = event.target.closest('[data-next]');
        if (nextBtn) {
            state.page += 1;
            fetchProducts({ reset: false });
            return;
        }
        const prevBtn = event.target.closest('[data-prev]');
        if (prevBtn) {
            state.page = Math.max(1, state.page - 1);
            fetchProducts({ reset: false });
            return;
        }
        const firstBtn = event.target.closest('[data-first]');
        if (firstBtn) {
            state.page = 1;
            fetchProducts({ reset: false });
            return;
        }
        const btn = event.target.closest('[data-page]');
        if (!btn) return;
        const nextPage = Number(btn.dataset.page);
        if (!Number.isFinite(nextPage) || nextPage === state.page) return;
        state.page = nextPage;
        fetchProducts({ reset: false });
    });
};
