export const el = {
    form: document.getElementById('add-product-form'),
    list: document.getElementById('admin-product-list'),
    submitBtn: document.querySelector('#add-product-form button[type="submit"]'),
    searchInput: document.getElementById('adminSearch'),
    pager: document.getElementById('adminPager'),
    formTitle: document.getElementById('formTitle'),
    imageInputsWrap: document.getElementById('imageInputs'),
    addImageBtn: document.getElementById('addImageBtn'),
    tabOverview: document.getElementById('tabOverview'),
    tabList: document.getElementById('tabList'),
    tabAdd: document.getElementById('tabAdd'),
    overviewView: document.getElementById('overviewView'),
    listView: document.getElementById('listView'),
    addView: document.getElementById('addView'),
    statTotal: document.getElementById('statTotal'),
    cancelEdit: document.getElementById('cancelEdit')
};

export const state = {
    editingId: null,
    adminProducts: [],
    searchTimer: null,
    page: 1,
    limit: 20,
    total: 0,
    isLoading: false
};

export const placeholderSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">' +
    '<rect width="56" height="56" fill="#0f172a"/>' +
    '<path d="M18 18l20 20M38 18l-20 20" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>' +
    '</svg>'
);
