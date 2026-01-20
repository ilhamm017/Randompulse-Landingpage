export const renderList = (state, el) => {
    const products = state.adminProducts;
    if (products.length === 0) {
        el.list.innerHTML = '<p class="text-sm text-slate-400">Belum ada barang.</p>';
        return;
    }

    el.list.innerHTML = `
        <div class="overflow-x-auto rounded-lg border border-slate-700/60">
            <table class="min-w-full text-left text-xs">
                <thead class="bg-slate-800/80 text-slate-300">
                    <tr>
                        <th class="px-3 py-2 font-semibold">No</th>
                        <th class="px-3 py-2 font-semibold">Nama</th>
                        <th class="px-3 py-2 font-semibold">Harga</th>
                        <th class="px-3 py-2 font-semibold">Link</th>
                        <th class="px-3 py-2 font-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody class="bg-slate-900/40 text-slate-100">
                    ${products.map((product) => `
                        <tr class="border-t border-slate-800/80">
                            <td class="px-3 py-2 font-semibold">${product.productNumber ?? '-'}</td>
                            <td class="px-3 py-2 font-semibold">${product.name}</td>
                            <td class="px-3 py-2">${product.price}</td>
                            <td class="px-3 py-2 truncate max-w-[140px]">${product.link}</td>
                            <td class="px-3 py-2">
                                <button class="btn-3d rounded-md bg-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-900"
                                    data-action="edit" data-id="${product.id}">EDIT</button>
                                <button class="btn-3d rounded-md bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white"
                                    data-action="delete" data-id="${product.id}">HAPUS</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
};

export const renderPager = (state, el) => {
    const totalPages = Math.ceil(state.total / state.limit);
    if (!totalPages) {
        if (el.pager) el.pager.innerHTML = '';
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

    if (el.pager) el.pager.innerHTML = buttons.join('');
};
