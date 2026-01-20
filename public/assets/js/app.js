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

    if (!form || !list) return;

    const renderList = () => {
        const products = getProducts();
        list.innerHTML = products.map(p => `
            <div class="product-list-item">
                <span>${p.name} (${p.price})</span>
                <span class="delete-btn" onclick="deleteProduct('${p.id}')">HAPUS</span>
            </div>
        `).join('');
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProduct = {
            id: Date.now().toString(),
            name: form.name.value,
            price: form.price.value,
            description: form.description.value,
            image: form.image.value || 'https://placehold.co/400x400/eee/333?text=No+Image',
            link: form.link.value
        };

        const products = getProducts();
        products.unshift(newProduct);
        saveProducts(products);
        form.reset();
        renderList();
        alert('Barang berhasil ditambahkan!');
    });

    window.deleteProduct = (id) => {
        if (confirm('Yakin mau dihapus?')) {
            const products = getProducts().filter(p => p.id !== id);
            saveProducts(products);
            renderList();
        }
    };

    renderList();
};

const initAutoFill = () => {
    const fetchBtn = document.getElementById('fetch-btn');
    const linkInput = document.querySelector('input[name="link"]');
    const form = document.getElementById('add-product-form');

    if (!fetchBtn || !linkInput || !form) return;

    fetchBtn.addEventListener('click', async () => {
        const url = linkInput.value;
        if (!url) {
            alert('Masukkan link dulu bos!');
            return;
        }

        fetchBtn.disabled = true;
        fetchBtn.textContent = 'Scraping Server (Wait)...';

        try {
            // Call our new Node.js local scraper
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const json = await res.json();

            if (json.status === 'success') {
                const meta = json.data;
                // Auto-fill fields
                if (meta.title) form.name.value = meta.title;
                if (meta.description) form.description.value = meta.description;
                if (meta.image) form.image.value = meta.image;
                if (meta.price) form.price.value = meta.price; // New: Fill Price

                alert('Scraping Berhasil! Silakan cek data.');
            } else {
                throw new Error(json.message || 'Gagal');
            }
        } catch (error) {
            console.error(error);
            alert('Gagal scraping. Cek localhost:3000/debug.png untuk melihat apa yang dilihat server.');
        } finally {
            fetchBtn.disabled = false;
            fetchBtn.textContent = '✨ Auto-Isi Data';
        }
    });
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
    initAutoFill();
});
