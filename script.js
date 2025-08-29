// --- STATE MANAGEMENT ---
let appState = {};

function loadState() {
    const savedState = localStorage.getItem('pokemonTrackerState');
    if (savedState) {
        appState = JSON.parse(savedState);
        if (!appState.team) appState.team = Array(6).fill(null); // Ensure team exists
    } else {
        // Initialize state if nothing is saved
        appState.pokedex = {};
        appState.team = Array(6).fill(null); // 6 empty slots
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
    renderTeamBuilder(); // Update box if a pokemon is now caught/uncaught
}

function updateCheckboxState(category, itemName, isChecked) {
    const items = new Set(appState[category] || []);
    if (isChecked) { items.add(itemName); } 
    else { items.delete(itemName); }
    appState[category] = Array.from(items);
    saveState();
    updateDashboard();
}

function addPokemonToTeam(pokemonName) {
    const emptySlotIndex = appState.team.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
        appState.team[emptySlotIndex] = pokemonName;
        saveState();
        renderTeamBuilder();
    } else {
        alert("Your team is full!"); // Replace with a modal in a future update
    }
}

function removePokemonFromTeam(index) {
    appState.team[index] = null;
    saveState();
    renderTeamBuilder();
}


// --- RENDERING ---

function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    grid.innerHTML = '';
    
    POKEDEX_STATUSES.forEach(status => {
        const total = DATA.pokedex.length;
        const completed = Object.values(appState.pokedex).filter(s => POKEDEX_STATUSES.indexOf(s) >= POKEDEX_STATUSES.indexOf(status)).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const title = `Pokédex ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        grid.innerHTML += createProgressCard(`pokedex-${status}`, title, completed, total, percentage);
    });

    CATEGORIES.forEach(cat => {
        const total = DATA[cat.id].length;
        const completed = appState[cat.id]?.length || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        grid.innerHTML += createProgressCard(cat.id, cat.title, completed, total, percentage);
    });
}

function createProgressCard(id, title, completed, total, percentage) {
    return `
        <div class="bg-white p-5 rounded-xl shadow-sm">
            <h3 class="font-semibold text-lg mb-3 text-gray-800">${title}</h3>
            <div class="flex justify-between items-center mb-1 text-sm text-gray-500">
                <span>Progress</span><span id="${id}-progress-text">${completed} / ${total}</span>
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
            const typesHtml = p.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');

            grid.innerHTML += `
                <div class="bg-white p-3 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-700 font-medium">${p.id}. ${p.name}</span>
                        <div class="pokedex-status-icons" data-pokemon-name="${p.name}">
                            <i class="fas fa-eye status-icon seen ${seenActive}" data-status="seen"></i>
                            <i class="fas fa-fist-raised status-icon battled ${battledActive}" data-status="battled"></i>
                            <i class="fas fa-circle-check status-icon caught ${caughtActive}" data-status="caught"></i>
                        </div>
                    </div>
                    <div class="mt-2 flex gap-1">${typesHtml}</div>
                </div>`;
    });
}

function renderTeamBuilder(filter = '') {
    const slotsGrid = document.getElementById('team-slots-grid');
    const boxGrid = document.getElementById('pokemon-box-grid');
    slotsGrid.innerHTML = '';
    boxGrid.innerHTML = '';

    // Render Team Slots
    appState.team.forEach((pokemonName, index) => {
        if (pokemonName) {
            const pokemonData = DATA.pokedex.find(p => p.name === pokemonName);
            const typesHtml = pokemonData.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
            slotsGrid.innerHTML += `
                <div class="team-slot">
                    <button class="remove-team-member" data-index="${index}">&times;</button>
                    <p class="font-bold text-lg">${pokemonName}</p>
                    <div class="mt-1 flex gap-1">${typesHtml}</div>
                </div>`;
        } else {
            slotsGrid.innerHTML += `<div class="empty-slot"><i class="fas fa-plus empty-slot-icon"></i></div>`;
        }
    });

    // Render Pokémon Box
    const caughtPokemon = Object.keys(appState.pokedex).filter(name => appState.pokedex[name] === 'caught');
    const lowercasedFilter = filter.toLowerCase();

    caughtPokemon
        .filter(name => name.toLowerCase().includes(lowercasedFilter) && !appState.team.includes(name))
        .forEach(name => {
            const pokemonData = DATA.pokedex.find(p => p.name === name);
            const typesHtml = pokemonData.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
            boxGrid.innerHTML += `
                <div class="box-pokemon" data-name="${name}">
                    <span>${name}</span>
                    <div class="flex gap-1">${typesHtml}</div>
                </div>`;
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
            grid.innerHTML += `
                <label class="list-item-container">
                    <input type="checkbox" data-category="${category}" data-name="${item.name}" class="checkbox-style" ${isChecked ? 'checked' : ''}>
                    <span class="ml-3 text-gray-700">${item.id ? `TM${String(item.id).padStart(3, '0')}: ` : ''}${item.name}</span>
                </label>`;
    });
}

function renderGyms() {
    const grid = document.getElementById('gyms-grid');
    grid.innerHTML = '';
    DATA.gyms.forEach(gym => {
        const isChecked = appState.gyms?.includes(gym.name) || false;
        grid.innerHTML += `
            <div class="gym-card">
                <input type="checkbox" data-category="gyms" data-name="${gym.name}" class="checkbox-style flex-shrink-0" ${isChecked ? 'checked' : ''}>
                <div class="gym-info">
                    <h4 class="font-bold text-lg text-gray-800">${gym.name}</h4>
                    <p class="text-gray-500">${gym.leader}</p>
                    <span class="gym-type ${TYPE_COLORS[gym.type]}">${gym.type}</span>
                </div>
            </div>`;
    });
}

// --- EVENT HANDLING & INITIALIZATION ---

function setupEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(`${button.dataset.view}-view`).classList.add('active');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            if (button.dataset.view === 'team-builder') renderTeamBuilder();
        });
    });

    const mainElement = document.querySelector('main');
    // Pokedex icon clicks
    mainElement.addEventListener('click', (e) => {
        const statusIcon = e.target.closest('.status-icon');
        if (statusIcon) {
            updatePokedexStatus(statusIcon.parentElement.dataset.pokemonName, statusIcon.dataset.status);
        }
        // Team Builder Clicks
        const boxPokemon = e.target.closest('.box-pokemon');
        if (boxPokemon) addPokemonToTeam(boxPokemon.dataset.name);
        
        const removeButton = e.target.closest('.remove-team-member');
        if (removeButton) removePokemonFromTeam(parseInt(removeButton.dataset.index));

        const emptySlot = e.target.closest('.empty-slot');
        if (emptySlot) document.getElementById('box-search').focus();
    });

    // Checkbox changes for Gyms, TMs, Items
    mainElement.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updateCheckboxState(e.target.dataset.category, e.target.dataset.name, e.target.checked);
        }
    });

    // Search/Filter Listeners
    document.getElementById('pokedex-search').addEventListener('input', (e) => renderPokedex(e.target.value));
    document.getElementById('tms-search').addEventListener('input', (e) => renderGenericList('tms', 'tms-grid', e.target.value));
    document.getElementById('items-search').addEventListener('input', (e) => renderGenericList('items', 'items-grid', e.target.value));
    document.getElementById('box-search').addEventListener('input', (e) => renderTeamBuilder(e.target.value));
}

function initializeApp() {
    loadState();
    renderDashboard();
    renderPokedex();
    renderGyms();
    renderGenericList('tms', 'tms-grid');
    renderGenericList('items', 'items-grid');
    renderTeamBuilder(); // Initial render for team state
    setupEventListeners();
}

// Start the app
initializeApp();

