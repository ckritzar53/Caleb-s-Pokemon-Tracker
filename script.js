// --- STATE MANAGEMENT ---
let appState = {};

function loadState() {
    const savedState = localStorage.getItem('pokemonTrackerState');
    if (savedState) {
        appState = JSON.parse(savedState);
    } else {
        // Initialize state if nothing is saved
        appState.pokedex = {}; // Use an object for advanced status
        CATEGORIES.forEach(cat => {
            appState[cat.id] = [];
        });
    }
}

function saveState() {
    localStorage.setItem('pokemonTrackerState', JSON.stringify(appState));
}

function updatePokedexStatus(pokemonName, status) {
    if (appState.pokedex[pokemonName] === status) {
        delete appState.pokedex[pokemonName];
    } else {
        appState.pokedex[pokemonName] = status;
    }
    saveState();
    renderPokedex(document.getElementById('pokedex-search').value);
    updateDashboard();
}

function updateCheckboxState(category, itemName, isChecked) {
    const items = new Set(appState[category] || []);
    if (isChecked) {
        items.add(itemName);
    } else {
        items.delete(itemName);
    }
    appState[category] = Array.from(items);
    saveState();
    updateDashboard();
}

// --- RENDERING ---

function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    grid.innerHTML = '';
    
    // Pokedex Progress Cards
    POKEDEX_STATUSES.forEach(status => {
        const total = DATA.pokedex.length;
        const completed = Object.values(appState.pokedex).filter(s => POKEDEX_STATUSES.indexOf(s) >= POKEDEX_STATUSES.indexOf(status)).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const title = `Pokédex ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const card = createProgressCard(`pokedex-${status}`, title, completed, total, percentage);
        grid.innerHTML += card;
    });

    // Other Categories Progress Cards
    CATEGORIES.forEach(cat => {
        const total = DATA[cat.id].length;
        const completed = appState[cat.id]?.length || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const card = createProgressCard(cat.id, cat.title, completed, total, percentage);
        grid.innerHTML += card;
    });
}

function createProgressCard(id, title, completed, total, percentage) {
    return `
        <div class="bg-white p-5 rounded-xl shadow-sm">
            <h3 class="font-semibold text-lg mb-3 text-gray-800">${title}</h3>
            <div class="flex justify-between items-center mb-1 text-sm text-gray-500">
                <span>Progress</span>
                <span id="${id}-progress-text">${completed} / ${total}</span>
            </div>
            <div class="w-full progress-bar-bg rounded-full h-2">
                <div id="${id}-progress-bar" class="progress-bar-fill h-2 rounded-full" style="width: ${percentage}%"></div>
            </div>
        </div>`;
}


function updateDashboard() {
     POKEDEX_STATUSES.forEach(status => {
        const total = DATA.pokedex.length;
        const completed = Object.values(appState.pokedex).filter(s => POKEDEX_STATUSES.indexOf(s) >= POKEDEX_STATUSES.indexOf(status)).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        document.getElementById(`pokedex-${status}-progress-text`).textContent = `${completed} / ${total}`;
        document.getElementById(`pokedex-${status}-progress-bar`).style.width = `${percentage}%`;
    });
    CATEGORIES.forEach(cat => {
        const total = DATA[cat.id].length;
        const completed = appState[cat.id]?.length || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        document.getElementById(`${cat.id}-progress-text`).textContent = `${completed} / ${total}`;
        document.getElementById(`${cat.id}-progress-bar`).style.width = `${percentage}%`;
    });
}

function renderPokedex(filter = '') {
    const grid = document.getElementById('pokedex-grid');
    grid.innerHTML = '';
    const lowercasedFilter = filter.toLowerCase();

    DATA.pokedex
        .filter(p => p.name.toLowerCase().includes(lowercasedFilter))
        .forEach(p => {
            const currentStatus = appState.pokedex[p.name];
            const seenActive = currentStatus && POKEDEX_STATUSES.indexOf(currentStatus) >= 0 ? 'active' : '';
            const battledActive = currentStatus && POKEDEX_STATUSES.indexOf(currentStatus) >= 1 ? 'active' : '';
            const caughtActive = currentStatus && POKEDEX_STATUSES.indexOf(currentStatus) >= 2 ? 'active' : '';

            const item = `
                <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <span class="text-gray-700 font-medium">${p.id}. ${p.name}</span>
                    <div class="pokedex-status-icons" data-pokemon-name="${p.name}">
                        <i class="fas fa-eye status-icon seen ${seenActive}" data-status="seen" title="Seen"></i>
                        <i class="fas fa-fist-raised status-icon battled ${battledActive}" data-status="battled" title="Battled"></i>
                        <i class="fas fa-circle-check status-icon caught ${caughtActive}" data-status="caught" title="Caught"></i>
                    </div>
                </div>`;
            grid.innerHTML += item;
    });
}

function renderGenericList(category, gridId, filter = '') {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    const lowercasedFilter = filter.toLowerCase();

    DATA[category]
        .filter(item => item.name.toLowerCase().includes(lowercasedFilter))
        .forEach(item => {
            const isChecked = appState[category]?.includes(item.name) || false;
            const element = `
                <label class="list-item-container">
                    <input type="checkbox" data-category="${category}" data-name="${item.name}" class="checkbox-style" ${isChecked ? 'checked' : ''}>
                    <span class="ml-3 text-gray-700">${item.id ? `TM${String(item.id).padStart(3, '0')}: ` : ''}${item.name}</span>
                </label>`;
            grid.innerHTML += element;
    });
}

function renderGyms() {
    const grid = document.getElementById('gyms-grid');
    grid.innerHTML = '';
    DATA.gyms.forEach(gym => {
        const isChecked = appState.gyms?.includes(gym.name) || false;
        const card = `
            <div class="gym-card">
                <input type="checkbox" data-category="gyms" data-name="${gym.name}" class="checkbox-style flex-shrink-0" ${isChecked ? 'checked' : ''}>
                <div class="gym-info">
                    <h4 class="font-bold text-lg text-gray-800">${gym.name}</h4>
                    <p class="text-gray-500">${gym.leader}</p>
                    <span class="gym-type ${gym.color}">${gym.type}</span>
                </div>
            </div>`;
        grid.innerHTML += card;
    });
}

// --- EVENT HANDLING & INITIALIZATION ---

function setupEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const viewId = button.dataset.view;
            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.getElementById(`${viewId}-view`).classList.add('active');
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Pokedex icon clicks
    document.querySelector('main').addEventListener('click', (e) => {
        const statusIcon = e.target.closest('.status-icon');
        if (statusIcon) {
            const pokemonName = statusIcon.parentElement.dataset.pokemonName;
            const status = statusIcon.dataset.status;
            updatePokedexStatus(pokemonName, status);
        }
    });

    // Checkbox changes for Gyms, TMs, Items
    document.querySelector('main').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const category = e.target.dataset.category;
            const name = e.target.dataset.name;
            const isChecked = e.target.checked;
            updateCheckboxState(category, name, isChecked);
        }
    });

    // Search/Filter Listeners
    document.getElementById('pokedex-search').addEventListener('input', (e) => renderPokedex(e.target.value));
    document.getElementById('tms-search').addEventListener('input', (e) => renderGenericList('tms', 'tms-grid', e.target.value));
    document.getElementById('items-search').addEventListener('input', (e) => renderGenericList('items', 'items-grid', e.target.value));
}

function initializeApp() {
    loadState();
    renderDashboard();
    renderPokedex();
    renderGyms();
    renderGenericList('tms', 'tms-grid');
    renderGenericList('items', 'items-grid');
    setupEventListeners();
}

// Start the app
initializeApp();

