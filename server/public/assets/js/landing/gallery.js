const renderImageDots = (state, el) => {
    if (!el.imageDots) return;
    if (state.activeImages.length <= 1) {
        el.imageDots.innerHTML = '';
        return;
    }
    el.imageDots.innerHTML = state.activeImages.map((_, idx) => `
        <button class="h-1.5 w-1.5 rounded-full ${idx === state.activeImageIndex ? 'bg-sky-400' : 'bg-slate-500'}"
            data-image-index="${idx}"></button>
    `).join('');
};

const setActiveImage = (state, el, index) => {
    if (!state.activeImages.length) return;
    state.activeImageIndex = (index + state.activeImages.length) % state.activeImages.length;
    el.detailImage.src = state.activeImages[state.activeImageIndex];
    renderImageDots(state, el);
};

export const renderGrid = (state, el, items, { append = false } = {}) => {
    if (!append) el.productGrid.innerHTML = '';
    if (items.length === 0 && state.products.length === 0) {
        el.productGrid.innerHTML = '<p class="col-span-2 sm:col-span-3 text-xs text-slate-400">Tidak ada hasil.</p>';
        return;
    }
    const html = items.map((product) => `
        <button class="product-card group rounded-xl border border-slate-700/60 bg-slate-900/40 p-2 text-left hover:-translate-y-0.5 hover:border-sky-400/80 hover:shadow-md transition"
            data-id="${product.id}">
            <img src="${product.image}" alt="${product.title}" class="mb-2 h-24 w-full rounded-lg object-cover">
            <div class="mb-1 text-[10px] font-semibold text-slate-400">No. ${product.number ?? '-'}</div>
            <h3 class="text-xs font-semibold text-slate-100 line-clamp-2">${product.title}</h3>
            <div class="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span class="price-chip rounded-full bg-slate-700 px-2 py-0.5 font-semibold">${product.price}</span>
                <span class="uppercase tracking-wider">${product.tag}</span>
            </div>
        </button>
    `).join('');
    el.productGrid.insertAdjacentHTML('beforeend', html);
};

const showDetail = (state, el, id) => {
    const product = state.products.find((item) => item.id === id);
    if (!product) return;
    state.activeImages = product.images && product.images.length ? product.images : [product.image];
    el.detailImage.alt = product.title;
    setActiveImage(state, el, 0);
    el.detailTitle.textContent = product.title;
    el.detailDesc.textContent = product.description;
    el.detailTag.textContent = product.price;
    el.detailLink.href = product.link;

    el.galleryView.classList.add('opacity-0');
    setTimeout(() => {
        el.galleryView.classList.add('hidden');
        el.detailView.classList.remove('hidden');
        requestAnimationFrame(() => el.detailView.classList.remove('opacity-0'));
    }, 150);
};

const showGallery = (el) => {
    el.detailView.classList.add('opacity-0');
    setTimeout(() => {
        el.detailView.classList.add('hidden');
        el.galleryView.classList.remove('hidden');
        requestAnimationFrame(() => el.galleryView.classList.remove('opacity-0'));
    }, 150);
};

export const initGallery = (state, el) => {
    el.productGrid.addEventListener('click', (event) => {
        const card = event.target.closest('[data-id]');
        if (!card) return;
        showDetail(state, el, card.dataset.id);
    });
    el.backBtn.addEventListener('click', () => showGallery(el));
};

export const initSlider = (state, el) => {
    el.prevImageBtn.addEventListener('click', () => setActiveImage(state, el, state.activeImageIndex - 1));
    el.nextImageBtn.addEventListener('click', () => setActiveImage(state, el, state.activeImageIndex + 1));
    el.imageDots.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-image-index]');
        if (!btn) return;
        setActiveImage(state, el, Number(btn.dataset.imageIndex));
    });
    let touchStartX = 0;
    let touchEndX = 0;
    el.detailImage.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    });
    el.detailImage.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) < 30) return;
        if (delta > 0) {
            setActiveImage(state, el, state.activeImageIndex - 1);
        } else {
            setActiveImage(state, el, state.activeImageIndex + 1);
        }
    });
};
