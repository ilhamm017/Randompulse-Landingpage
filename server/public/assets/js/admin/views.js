const setTabActive = (activeTab, tabs) => {
    tabs.forEach((tab) => {
        const isActive = tab === activeTab;
        tab.classList.toggle('bg-sky-500/20', isActive);
        tab.classList.toggle('text-sky-200', isActive);
        tab.classList.toggle('ring-1', isActive);
        tab.classList.toggle('ring-sky-400/60', isActive);
        tab.classList.toggle('bg-slate-700/50', !isActive);
        tab.classList.toggle('text-slate-300', !isActive);
    });
};

export const showOverviewView = (el) => {
    el.overviewView.classList.remove('hidden');
    el.listView.classList.add('hidden');
    el.addView.classList.add('hidden');
    setTabActive(el.tabOverview, [el.tabOverview, el.tabList, el.tabAdd]);
};

export const showListView = (el) => {
    el.overviewView.classList.add('hidden');
    el.listView.classList.remove('hidden');
    el.addView.classList.add('hidden');
    setTabActive(el.tabList, [el.tabOverview, el.tabList, el.tabAdd]);
};

export const showAddView = (el) => {
    el.overviewView.classList.add('hidden');
    el.listView.classList.add('hidden');
    el.addView.classList.remove('hidden');
    setTabActive(el.tabAdd, [el.tabOverview, el.tabList, el.tabAdd]);
};
