export const state = {
    products: [],
    page: 1,
    limit: 20,
    total: 0,
    isLoading: false,
    activeImages: [],
    activeImageIndex: 0,
    searchTimer: null
};

export const el = {
    themeToggle: document.getElementById('themeToggle'),
    menuToggle: document.getElementById('menuToggle'),
    menuItems: document.getElementById('menuItems'),
    menuChevron: document.getElementById('menuChevron'),
    searchInput: document.getElementById('searchInput'),
    galleryView: document.getElementById('galleryView'),
    detailView: document.getElementById('detailView'),
    productGrid: document.getElementById('productGrid'),
    loadState: document.getElementById('loadState'),
    pager: document.getElementById('pager'),
    detailImage: document.getElementById('detailImage'),
    detailTitle: document.getElementById('detailTitle'),
    detailDesc: document.getElementById('detailDesc'),
    detailTag: document.getElementById('detailTag'),
    detailLink: document.getElementById('detailLink'),
    backBtn: document.getElementById('backBtn'),
    prevImageBtn: document.getElementById('prevImage'),
    nextImageBtn: document.getElementById('nextImage'),
    imageDots: document.getElementById('imageDots')
};
