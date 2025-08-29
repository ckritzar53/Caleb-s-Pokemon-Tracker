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
    // If the current status is clicked again, set it to none.
    if (appState.pokedex[pokemonName] === status) {
        delete appState.pokedex[pokemonName];
    } else {
        appState.pokedex[pokemonName] = status;
    }
    saveState();
    renderPokedex(document.getElementById('pokedex-search').value); // Re-render to update UI
    updateDashboard();
}

function updateCheckboxState(category, itemName, isChecked) {
    const items = new Set(appState[category]);
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
    
    // Advanced Pokedex Progress
    POKEDEX_STATUSES.forEach(status => {
        const total = DATA.pokedex.length;
        const completed = Object.values(appState.pokedex).filter(s => POKEDEX_STATUSES.indexOf(s) >= POKEDEX_STATUSES.indexOf(status)).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const title = `Pokédex ${status.charAt(0).toUpperCase() + status.slice(1)}`;

        const card = `
            <div class="bg-gray-800 p-4 rounded-lg">
                <h3 class="font-semibold text-lg mb-2">${title}</h3>
                <div class="flex justify-between items-center mb-1 text-sm text-gray-400">
                    <span>Progress</span>
                    <span id="pokedex-${status}-progress-text">${completed} / ${total}</span>
                </div>
                <div class="w-full progress-bar-bg rounded-full h-2.5">
                    <div id="pokedex-${status}-progress-bar" class="progress-bar-fill h-2.5 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>`;
        grid.innerHTML += card;
    });

    // Other Categories Progress
    CATEGORIES.forEach(cat => {
        const total = DATA[cat.id].length;
        const completed = appState[cat.id]?.length || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const card = `
            <div class="bg-gray-800 p-4 rounded-lg">
                <h3 class="font-semibold text-lg mb-2">${cat.title}</h3>
                <div class="flex justify-between items-center mb-1 text-sm text-gray-400">
                    <span>Progress</span>
                    <span id="${cat.id}-progress-text">${completed} / ${total}</span>
                </div>
                <div class="w-full progress-bar-bg rounded-full h-2.5">
                    <div id="${cat.id}-progress-bar" class="progress-bar-fill h-2.5 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>`;
        grid.innerHTML += card;
    });
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
                <div class="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                    <span class="text-white">${p.id}. ${p.name}</span>
                    <div class="pokedex-status-icons" data-pokemon-name="${p.name}">
                        <i class="fas fa-eye status-icon seen ${seenActive}" data-status="seen" title="Seen"></i>
                        <i class="fas fa-fist-raised status-icon battled ${battledActive}" data-status="battled" title="Battled"></i>
                        <i class="fas fa-circle-check status-icon caught ${caughtActive}" data-status="caught" title="Caught"></i>
                    </div>
                </div>`;
            grid.innerHTML += item;
    });
}

function renderGenericList(category, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    DATA[category].forEach(item => {
        const isChecked = appState[category].includes(item.name);
        const element = `
            <label class="list-item-label flex items-center bg-gray-700 p-3 rounded-md hover:bg-gray-600">
                <input type="checkbox" data-category="${category}" data-name="${item.name}" class="w-5 h-5 rounded text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-600" ${isChecked ? 'checked' : ''}>
                <span class="ml-3 text-white">${item.id ? `${item.id}. ` : ''}${item.name}</span>
            </label>`;
        grid.innerHTML += element;
    });
}

function renderGyms() {
    const grid = document.getElementById('gyms-grid');
    grid.innerHTML = '';
    DATA.gyms.forEach(gym => {
        const isChecked = appState.gyms.includes(gym.name);
        const card = `
            <div class="gym-card">
                <input type="checkbox" data-category="gyms" data-name="${gym.name}" class="w-6 h-6 rounded text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-600 flex-shrink-0" ${isChecked ? 'checked' : ''}>
                <div class="gym-info">
                    <h4 class="font-bold text-xl">${gym.name}</h4>
                    <p class="text-gray-400">${gym.leader}</p>
                    <span class="gym-type ${gym.typeColor} text-gray-900">${gym.type} Type</span>
                </div>
            </div>`;
        grid.innerHTML += card;
    });
}


// --- EVENT HANDLING & INITIALIZATION ---

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const viewId = button.dataset.view;
            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.getElementById(`${viewId}-view`).classList.add('active');
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    document.querySelector('main').addEventListener('click', (e) => {
        const statusIcon = e.target.closest('.status-icon');
        if (statusIcon) {
            const pokemonName = statusIcon.parentElement.dataset.pokemonName;
            const status = statusIcon.dataset.status;
            updatePokedexStatus(pokemonName, status);
        }
    });

    document.querySelector('main').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const category = e.target.dataset.category;
            const name = e.target.dataset.name;
            const isChecked = e.target.checked;
            updateCheckboxState(category, name, isChecked);
        }
    });

    document.getElementById('pokedex-search').addEventListener('input', (e) => {
        renderPokedex(e.target.value);
    });
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

