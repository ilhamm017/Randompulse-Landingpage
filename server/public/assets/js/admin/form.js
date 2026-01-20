import { showAddView, showListView } from './views.js';

export const resetForm = (state, el, placeholderSvg) => {
    el.form.reset();
    state.editingId = null;
    if (el.submitBtn) el.submitBtn.textContent = 'Tambah Produk';
    if (el.formTitle) el.formTitle.textContent = 'Tambah Barang Baru';
    const previewImgs = document.querySelectorAll('.image-preview');
    previewImgs.forEach((img) => { img.src = placeholderSvg; });
    if (el.imageInputsWrap) {
        el.imageInputsWrap.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'image-row flex items-center gap-2';
        row.innerHTML = `
            <input type="url" name="image_1" placeholder="https://..."
                class="image-input w-full rounded-lg border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none">
            <div class="h-14 w-14 rounded-md border border-slate-700/60 bg-slate-900/40 p-1">
                <img class="image-preview h-full w-full rounded object-cover" alt="Preview" src="${placeholderSvg}">
            </div>
        `;
        el.imageInputsWrap.appendChild(row);
    }
};

export const addImageRow = (el, placeholderSvg) => {
    if (!el.imageInputsWrap) return;
    const inputs = el.imageInputsWrap.querySelectorAll('.image-input');
    if (inputs.length >= 5) return;
    const row = document.createElement('div');
    row.className = 'image-row flex items-center gap-2';
    row.innerHTML = `
        <input type="url" name="image_${inputs.length + 1}" placeholder="https://..."
            class="image-input w-full rounded-lg border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none">
        <div class="h-14 w-14 rounded-md border border-slate-700/60 bg-slate-900/40 p-1">
            <img class="image-preview h-full w-full rounded object-cover" alt="Preview" src="${placeholderSvg}">
        </div>
    `;
    el.imageInputsWrap.appendChild(row);
};

export const initImagePreview = (placeholderSvg) => {
    document.addEventListener('input', (event) => {
        if (!event.target.classList.contains('image-input')) return;
        const row = event.target.closest('.image-row');
        if (!row) return;
        const img = row.querySelector('.image-preview');
        if (!img) return;
        const url = event.target.value.trim();
        img.src = url || placeholderSvg;
    });

    document.addEventListener('error', (event) => {
        const target = event.target;
        if (!target.classList.contains('image-preview')) return;
        target.src = placeholderSvg;
    }, true);
};

export const initFormSubmit = (state, el, placeholderSvg, fetchProducts, renderList, renderPager) => {
    el.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const images = Array.from(document.querySelectorAll('.image-input'))
            .map((input) => input.value.trim())
            .filter(Boolean)
            .slice(0, 5);
        const productData = {
            name: el.form.name.value,
            price: el.form.price.value,
            description: el.form.description.value,
            image: images[0] || 'https://placehold.co/400x400/eee/333?text=No+Image',
            images,
            link: el.form.link.value
        };

        const wasEditing = Boolean(state.editingId);
        const request = state.editingId
            ? fetch(`/api/products/${state.editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
            : fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...productData, id: Date.now().toString() })
            });

        request
            .then((res) => res.json())
            .then(() => fetchProducts())
            .then(() => {
                resetForm(state, el, placeholderSvg);
                renderList(state, el);
                renderPager(state, el);
                alert(wasEditing ? 'Barang berhasil diperbarui!' : 'Barang berhasil ditambahkan!');
            })
            .catch(() => {
                alert('Gagal menyimpan data.');
            });
    });
};

export const handleDelete = (state, el, id, fetchProducts, renderList, renderPager, placeholderSvg) => {
    if (!confirm('Yakin mau dihapus?')) return;
    fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(() => fetchProducts())
        .then(() => {
            if (state.editingId === id) {
                resetForm(state, el, placeholderSvg);
            }
            renderList(state, el);
            renderPager(state, el);
        })
        .catch(() => {
            alert('Gagal menghapus data.');
        });
};

export const handleEdit = (state, el, placeholderSvg, product) => {
    if (!product) return;
    state.editingId = product.id;
    el.form.name.value = product.name || '';
    el.form.price.value = product.price || '';
    el.form.description.value = product.description || '';
    const imageList = Array.isArray(product.images) && product.images.length
        ? product.images
        : (product.image ? [product.image] : []);
    if (el.imageInputsWrap) {
        el.imageInputsWrap.innerHTML = '';
        const count = Math.min(Math.max(imageList.length, 1), 5);
        for (let i = 0; i < count; i += 1) {
            const row = document.createElement('div');
            row.className = 'image-row flex items-center gap-2';
            row.innerHTML = `
                <input type="url" name="image_${i + 1}" placeholder="https://..."
                    class="image-input w-full rounded-lg border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    value="${imageList[i] || ''}">
                <div class="h-14 w-14 rounded-md border border-slate-700/60 bg-slate-900/40 p-1">
                    <img class="image-preview h-full w-full rounded object-cover" alt="Preview"
                        src="${imageList[i] || placeholderSvg}">
                </div>
            `;
            el.imageInputsWrap.appendChild(row);
        }
    }
    el.form.link.value = product.link || '';
    if (el.submitBtn) el.submitBtn.textContent = 'Simpan Perubahan';
    if (el.formTitle) {
        const num = product.productNumber ?? '-';
        el.formTitle.textContent = `Mengedit produk nomor ${num}`;
    }
    showAddView(el);
    el.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const initCancel = (state, el, placeholderSvg) => {
    if (!el.cancelEdit) return;
    el.cancelEdit.addEventListener('click', () => {
        resetForm(state, el, placeholderSvg);
        showListView(el);
    });
};
