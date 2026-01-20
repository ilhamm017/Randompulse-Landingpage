// Theme Management
const initTheme = () => {
    // Default is Light (no class).
    // If user has saved 'dark', apply class.
    const savedTheme = localStorage.getItem('randompulse_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches; // Optional check

    // Priority: Saved > System (if you want) > Default Light
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    updateThemeIcon();
};

const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('randompulse_theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
};

const updateThemeIcon = () => {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        const isDark = document.body.classList.contains('dark-mode');
        // If Dark Mode active: Show Sun (switch to light)
        // If Light Mode active: Show Moon (switch to dark)
        btn.innerHTML = isDark ? '☀️' : '🌙';
        btn.setAttribute('title', isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap');
    }
};

// State Management
const getProducts = () => {
    const stored = localStorage.getItem('randompulse_products');
    if (stored) {
        return JSON.parse(stored);
    }
    // If local storage is empty, initialize with data.js constant if available
    if (typeof initialProducts !== 'undefined') {
        localStorage.setItem('randompulse_products', JSON.stringify(initialProducts));
        return initialProducts;
    }
    return [];
};

const saveProducts = (products) => {
    localStorage.setItem('randompulse_products', JSON.stringify(products));
};

// Render Functions
const renderGallery = () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    const products = getProducts();
    if (products.length === 0) {
        galleryGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Belum ada barang nih.</p>';
        return;
    }

    galleryGrid.innerHTML = products.map(product => `
        <article class="product-card" onclick="window.location.href='detail.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Pilihan Editor</p>
                <span class="product-price">${product.price}</span>
            </div>
        </article>
    `).join('');
};

const renderDetail = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.querySelector('.product-detail');

    if (!container || !id) return;

    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        container.innerHTML = '<h2>Barang tidak ditemukan.</h2>';
        return;
    }

    // Update Meta Title for client side feel
    document.title = `${product.name} - Randompulse`;

    container.innerHTML = `
        <div class="detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-info">
            <h1>${product.name}</h1>
            <div class="detail-price">${product.price}</div>
            <p class="detail-desc">${product.description}</p>
            <a href="${product.link}" target="_blank" class="btn">Beli Sekarang</a>
            <br><br>
            <button class="btn-outline btn" onclick="window.history.back()">Kembali</button>
        </div>
    `;
};

const initAdmin = () => {
    const form = document.getElementById('add-product-form');
    const list = document.getElementById('admin-product-list');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const searchInput = document.getElementById('adminSearch');
    const pager = document.getElementById('adminPager');
    const formTitle = document.getElementById('formTitle');
    const imageInputsWrap = document.getElementById('imageInputs');
    const addImageBtn = document.getElementById('addImageBtn');
    const tabOverview = document.getElementById('tabOverview');
    const tabList = document.getElementById('tabList');
    const tabAdd = document.getElementById('tabAdd');
    const overviewView = document.getElementById('overviewView');
    const listView = document.getElementById('listView');
    const addView = document.getElementById('addView');
    const statTotal = document.getElementById('statTotal');

    if (!form || !list) return;

    let editingId = null;
    let adminProducts = [];
    let searchTimer = null;
    let page = 1;
    const limit = 20;
    let total = 0;
    let isLoading = false;

    const fetchProducts = async () => {
        if (isLoading) return;
        isLoading = true;
        const term = (searchInput?.value || '').trim();
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (term) params.set('q', term);
        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        adminProducts = json.items || [];
        total = json.total || 0;
        isLoading = false;
        if (statTotal) statTotal.textContent = String(total);
        return adminProducts;
    };

    const renderList = () => {
        const products = adminProducts;
        if (products.length === 0) {
            list.innerHTML = '<p class="text-sm text-slate-400">Belum ada barang.</p>';
            return;
        }

        list.innerHTML = `
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
                        ${products.map(p => `
                            <tr class="border-t border-slate-800/80">
                                <td class="px-3 py-2 font-semibold">${p.productNumber ?? '-'}</td>
                                <td class="px-3 py-2 font-semibold">${p.name}</td>
                                <td class="px-3 py-2">${p.price}</td>
                                <td class="px-3 py-2 truncate max-w-[140px]">${p.link}</td>
                                <td class="px-3 py-2">
                                    <button class="btn-3d rounded-md bg-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-900"
                                        onclick="editProduct('${p.id}')">EDIT</button>
                                    <button class="btn-3d rounded-md bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white"
                                        onclick="deleteProduct('${p.id}')">HAPUS</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    const renderPager = () => {
        const totalPages = Math.ceil(total / limit);
        if (!totalPages) {
            if (pager) pager.innerHTML = '';
            return;
        }
        const buttons = [];
        const lastPage = totalPages;
        const windowSize = 7;
        let start = Math.max(2, page - Math.floor(windowSize / 2));
        let end = Math.min(lastPage - 1, start + windowSize - 1);
        start = Math.max(2, end - windowSize + 1);

        if (page > 1) {
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

        const isFirstActive = page === 1;
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
            const isActive = i === page;
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
            const isLastActive = page === lastPage;
            buttons.push(`
                <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold ${isLastActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-900'}"
                    data-page="${lastPage}">
                    ${lastPage}
                </button>
            `);
        }

        if (page < lastPage) {
            buttons.push(`
                <button class="btn-3d rounded-md px-3 py-1 text-[10px] font-semibold bg-slate-200 text-slate-900"
                    data-next="true">
                    Next
                </button>
            `);
        }

        if (pager) pager.innerHTML = buttons.join('');
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const images = Array.from(document.querySelectorAll('.image-input'))
            .map((input) => input.value.trim())
            .filter(Boolean)
            .slice(0, 5);
        const productData = {
            name: form.name.value,
            price: form.price.value,
            description: form.description.value,
            image: images[0] || 'https://placehold.co/400x400/eee/333?text=No+Image',
            images,
            link: form.link.value
        };

        const wasEditing = Boolean(editingId);
        const request = editingId
            ? fetch(`/api/products/${editingId}`, {
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
                form.reset();
                editingId = null;
                if (submitBtn) submitBtn.textContent = 'Tambah Produk';
                if (formTitle) formTitle.textContent = 'Tambah Barang Baru';
                const previewImgs = document.querySelectorAll('.image-preview');
                previewImgs.forEach((img) => { img.src = placeholderSvg; });
                if (imageInputsWrap) {
                    imageInputsWrap.innerHTML = '';
                    const row = document.createElement('div');
                    row.className = 'image-row flex items-center gap-2';
                    row.innerHTML = `
                        <input type="url" name="image_1" placeholder="https://..."
                            class="image-input w-full rounded-lg border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none">
                        <div class="h-14 w-14 rounded-md border border-slate-700/60 bg-slate-900/40 p-1">
                            <img class="image-preview h-full w-full rounded object-cover" alt="Preview" src="${placeholderSvg}">
                        </div>
                    `;
                    imageInputsWrap.appendChild(row);
                }
                renderList();
                renderPager();
                alert(wasEditing ? 'Barang berhasil diperbarui!' : 'Barang berhasil ditambahkan!');
            })
            .catch(() => {
                alert('Gagal menyimpan data.');
            });
    });

    window.deleteProduct = (id) => {
        if (confirm('Yakin mau dihapus?')) {
            fetch(`/api/products/${id}`, { method: 'DELETE' })
                .then(() => fetchProducts())
                .then(() => {
                    if (editingId === id) {
                        editingId = null;
                        form.reset();
                        if (submitBtn) submitBtn.textContent = 'Tambah Produk';
                        if (formTitle) formTitle.textContent = 'Tambah Barang Baru';
                    }
                    renderList();
                    renderPager();
                })
                .catch(() => {
                    alert('Gagal menghapus data.');
                });
        }
    };

    window.editProduct = (id) => {
        const product = adminProducts.find(p => p.id === id);
        if (!product) return;
        editingId = id;
        form.name.value = product.name || '';
        form.price.value = product.price || '';
        form.description.value = product.description || '';
        let parsedImages = [];
        if (Array.isArray(product.images)) {
            parsedImages = product.images;
        } else if (typeof product.images === 'string' && product.images.trim()) {
            try {
                const temp = JSON.parse(product.images);
                if (Array.isArray(temp)) parsedImages = temp;
            } catch (e) { }
        }
        const imageList = parsedImages.length
            ? parsedImages
            : (product.image ? [product.image] : []);
        if (imageInputsWrap) {
            imageInputsWrap.innerHTML = '';
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
                imageInputsWrap.appendChild(row);
            }
        }
        form.link.value = product.link || '';
        if (submitBtn) submitBtn.textContent = 'Simpan Perubahan';
        if (formTitle) {
            const num = product.productNumber ?? '-';
            formTitle.textContent = `Mengedit produk nomor ${num}`;
        }
        if (listView && addView && tabList && tabAdd && overviewView && tabOverview) {
            listView.classList.add('hidden');
            addView.classList.remove('hidden');
            overviewView.classList.add('hidden');
            tabOverview.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
            tabOverview.classList.add('bg-slate-700/50', 'text-slate-300');
            tabList.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
            tabList.classList.add('bg-slate-700/50', 'text-slate-300');
            tabAdd.classList.remove('bg-slate-700/50', 'text-slate-300');
            tabAdd.classList.add('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        }
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (addImageBtn && imageInputsWrap) {
        addImageBtn.addEventListener('click', () => {
            const inputs = imageInputsWrap.querySelectorAll('.image-input');
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
            imageInputsWrap.appendChild(row);
        });
    }

    const placeholderSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"56\" height=\"56\" viewBox=\"0 0 56 56\">' +
        '<rect width=\"56\" height=\"56\" fill=\"#0f172a\"/>' +
        '<path d=\"M18 18l20 20M38 18l-20 20\" stroke=\"#94a3b8\" stroke-width=\"4\" stroke-linecap=\"round\"/>' +
        '</svg>'
    );

    const setPreviewSrc = (img, url) => {
        img.src = url || placeholderSvg;
    };

    document.addEventListener('input', (event) => {
        if (!event.target.classList.contains('image-input')) return;
        const row = event.target.closest('.image-row');
        if (!row) return;
        const img = row.querySelector('.image-preview');
        if (!img) return;
        const url = event.target.value.trim();
        setPreviewSrc(img, url);
    });

    document.addEventListener('error', (event) => {
        const target = event.target;
        if (!target.classList.contains('image-preview')) return;
        target.src = placeholderSvg;
    }, true);

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                page = 1;
                fetchProducts().then(() => {
                    renderList();
                    renderPager();
                });
            }, 300);
        });
    }

    const showListView = () => {
        if (!listView || !addView || !tabList || !tabAdd || !overviewView || !tabOverview) return;
        listView.classList.remove('hidden');
        addView.classList.add('hidden');
        overviewView.classList.add('hidden');
        tabList.classList.add('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabList.classList.remove('bg-slate-700/50', 'text-slate-300');
        tabAdd.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabAdd.classList.add('bg-slate-700/50', 'text-slate-300');
        tabOverview.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabOverview.classList.add('bg-slate-700/50', 'text-slate-300');
    };

    const showAddView = () => {
        if (!listView || !addView || !tabList || !tabAdd || !overviewView || !tabOverview) return;
        listView.classList.add('hidden');
        addView.classList.remove('hidden');
        overviewView.classList.add('hidden');
        tabList.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabList.classList.add('bg-slate-700/50', 'text-slate-300');
        tabAdd.classList.remove('bg-slate-700/50', 'text-slate-300');
        tabAdd.classList.add('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabOverview.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabOverview.classList.add('bg-slate-700/50', 'text-slate-300');
    };

    const showOverviewView = () => {
        if (!listView || !addView || !tabList || !tabAdd || !overviewView || !tabOverview) return;
        listView.classList.add('hidden');
        addView.classList.add('hidden');
        overviewView.classList.remove('hidden');
        tabOverview.classList.add('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabOverview.classList.remove('bg-slate-700/50', 'text-slate-300');
        tabList.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabList.classList.add('bg-slate-700/50', 'text-slate-300');
        tabAdd.classList.remove('bg-sky-500/20', 'text-sky-200', 'ring-1', 'ring-sky-400/60');
        tabAdd.classList.add('bg-slate-700/50', 'text-slate-300');
    };

    if (tabOverview) tabOverview.addEventListener('click', showOverviewView);
    if (tabList) tabList.addEventListener('click', showListView);
    if (tabAdd) tabAdd.addEventListener('click', showAddView);

    if (pager) {
        pager.addEventListener('click', (event) => {
            const nextBtn = event.target.closest('[data-next]');
            if (nextBtn) {
                page += 1;
                fetchProducts().then(() => {
                    renderList();
                    renderPager();
                });
                return;
            }
            const prevBtn = event.target.closest('[data-prev]');
            if (prevBtn) {
                page = Math.max(1, page - 1);
                fetchProducts().then(() => {
                    renderList();
                    renderPager();
                });
                return;
            }
            const firstBtn = event.target.closest('[data-first]');
            if (firstBtn) {
                page = 1;
                fetchProducts().then(() => {
                    renderList();
                    renderPager();
                });
                return;
            }
            const btn = event.target.closest('[data-page]');
            if (!btn) return;
            const nextPage = Number(btn.dataset.page);
            if (!Number.isFinite(nextPage) || nextPage === page) return;
            page = nextPage;
            fetchProducts().then(() => {
                renderList();
                renderPager();
            });
        });
    }

    fetchProducts().then(() => {
        renderList();
        renderPager();
    });

    showOverviewView();
};


// Init
document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Add event listener to toggle if not added inline
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

    renderGallery();
    renderDetail();
    initAdmin();
});
