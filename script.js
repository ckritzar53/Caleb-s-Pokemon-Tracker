// --- STATE MANAGEMENT ---
let appState = {};

function loadState() {
    const savedState = localStorage.getItem('pokemonTrackerState');
    if (savedState) {
        appState = JSON.parse(savedState);
    } else {
        // Initialize state if nothing is saved
        CATEGORIES.forEach(cat => {
            appState[cat.id] = [];
        });
    }
}

function saveState() {
    localStorage.setItem('pokemonTrackerState', JSON.stringify(appState));
}

function updateItemState(category, itemName, isChecked) {
    const items = new Set(appState[category]);
    if (isChecked) {
        items.add(itemName);
    } else {
        items.delete(itemName);
    }
    appState[category] = Array.from(items);
    saveState();
    updateDashboard(); // Update progress bars on change
}


// --- RENDERING ---

function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    grid.innerHTML = '';
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
            </div>
        `;
        grid.innerHTML += card;
    });
}

function updateDashboard() {
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
            const isChecked = appState.pokedex.includes(p.name);
            const item = `
                <label class="list-item-label flex items-center bg-gray-700 p-3 rounded-md hover:bg-gray-600">
                    <input type="checkbox" data-category="pokedex" data-name="${p.name}" class="w-5 h-5 rounded text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-600" ${isChecked ? 'checked' : ''}>
                    <span class="ml-3 text-white">${p.id}. ${p.name}</span>
                </label>
            `;
            grid.innerHTML += item;
    });
}

function renderStory() {
    const grid = document.getElementById('story-grid');
    grid.innerHTML = '';
    DATA.story.forEach(s => {
        const isChecked = appState.story.includes(s.name);
        const item = `
            <label class="list-item-label flex items-center bg-gray-700 p-3 rounded-md hover:bg-gray-600">
                <input type="checkbox" data-category="story" data-name="${s.name}" class="w-5 h-5 rounded text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-600" ${isChecked ? 'checked' : ''}>
                <span class="ml-3 text-white">${s.name}</span>
            </label>
        `;
        grid.innerHTML += item;
    });
}


// --- EVENT HANDLING & INITIALIZATION ---

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const viewId = button.dataset.view;
            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.getElementById(`${viewId}-view`).classList.add('active');

            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Checkbox changes (event delegation)
    document.querySelector('main').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const category = e.target.dataset.category;
            const name = e.target.dataset.name;
            const isChecked = e.target.checked;
            updateItemState(category, name, isChecked);
        }
    });

    // Pokédex search
    document.getElementById('pokedex-search').addEventListener('input', (e) => {
        renderPokedex(e.target.value);
    });
}

function initializeApp() {
    loadState();
    renderDashboard();
    renderPokedex();
    renderStory();
    setupEventListeners();
}

// Start the app
initializeApp();
