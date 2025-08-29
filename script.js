// --- STATE MANAGEMENT ---
let appState = {};
let currentEditingIndex = null;

const createDefaultTeamMember = (species) => {
    const speciesData = DATA.pokedex.find(p => p.name === species);
    return {
        species, nickname: species, level: 5, 
        gender: speciesData.genders[0] || 'Genderless', 
        item: '', ability: '', nature: 'Hardy', metLocation: '',
        stats: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
        evs: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spatk: 31, spdef: 31, speed: 31 },
        moves: ['', '', '', ''], memories: '',
    };
};

function loadState() {
    try {
        const savedState = localStorage.getItem('pokemonTrackerState');
        const initialState = { pokedex: {}, team: Array(6).fill(null), gyms: [], tms: [], items: [], sandwiches: [] };
        appState = savedState ? JSON.parse(savedState) : initialState;
        
        if (!appState.pokedex || typeof appState.pokedex !== 'object') appState.pokedex = {};
        if (!appState.team || !Array.isArray(appState.team)) appState.team = Array(6).fill(null);
        CATEGORIES.forEach(cat => {
            if (!appState[cat.id] || !Array.isArray(appState[cat.id])) appState[cat.id] = [];
        });

    } catch (e) {
        console.error("Could not load or parse state, resetting.", e);
        appState = { pokedex: {}, team: Array(6).fill(null), gyms: [], tms: [], items: [], sandwiches: [] };
    }
}

function saveState() {
    try {
        localStorage.setItem('pokemonTrackerState', JSON.stringify(appState));
    } catch (e) {
        console.error("Failed to save state:", e);
    }
}

// --- THEME MANAGEMENT ---
function applyTheme(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}


// --- CORE LOGIC & UPDATES ---
function updatePokedexStatus(pokemonName, clickedStatus) {
    const currentStatus = appState.pokedex[pokemonName];
    const newStatus = currentStatus === clickedStatus ? null : clickedStatus;
    if (newStatus === null) {
        delete appState.pokedex[pokemonName];
    } else {
        appState.pokedex[pokemonName] = newStatus;
    }
    saveState();
    renderPokedex();
    renderDashboard();
    renderTeamBuilder();
}

// ... other update and core logic functions remain the same

// --- MODAL HANDLING ---
function openEditorModal(teamIndex) {
    currentEditingIndex = teamIndex;
    renderPokemonEditor();
    document.getElementById('pokemon-editor-modal').classList.remove('hidden');
}

function closeEditorModal() {
    document.getElementById('pokemon-editor-modal').classList.add('hidden');
    currentEditingIndex = null;
}

function openPokedexDetailModal(pokemonName) {
    const pokemon = DATA.pokedex.find(p => p.name === pokemonName);
    if (!pokemon) return;

    document.getElementById('detail-modal-title').textContent = `${pokemon.name} (#${String(pokemon.id).padStart(3, '0')})`;
    const typesHtml = pokemon.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
    const locationsHtml = pokemon.locations.length > 0
        ? `<ul>${pokemon.locations.map(loc => `<li class="text-primary ml-4 list-disc">${loc}</li>`).join('')}</ul>`
        : '<p class="text-secondary">No specific locations found (e.g., evolution).</p>';

    document.getElementById('detail-modal-body').innerHTML = `
        <div class="flex items-center gap-4 mb-4">${typesHtml}</div>
        <h4 class="font-semibold text-lg text-heading mb-2">Locations</h4>
        ${locationsHtml}
    `;
    document.getElementById('pokedex-detail-modal').classList.remove('hidden');
}

function closePokedexDetailModal() {
     document.getElementById('pokedex-detail-modal').classList.add('hidden');
}

// ... other modal functions remain the same

// --- RENDERING ---
function renderView(viewId) {
    const views = {
        dashboard: renderDashboard,
        pokedex: renderPokedex,
        team_builder: renderTeamBuilder,
        gyms: renderGyms,
        tms: () => renderGenericList('tms', 'TMs'),
        items: () => renderGenericList('items', 'Items'),
        sandwiches: () => renderGenericList('sandwiches', 'Sandwiches')
    };
    views[viewId.replace(/-/g, '_')]();
}

function renderPokedex() {
    const container = document.getElementById('pokedex-view');
    const filter = container.querySelector('input')?.value.toLowerCase() || '';
    const items = DATA.pokedex.filter(p => p.name.toLowerCase().includes(filter)).map(p => {
        // ... (existing pokedex rendering logic)
        const currentStatus = appState.pokedex[p.name];
        const statusIndex = currentStatus ? POKEDEX_STATUSES.indexOf(currentStatus) : -1;
        const seenClass = statusIndex >= 0 ? 'seen active' : 'seen';
        const battledClass = statusIndex >= 1 ? 'battled active' : 'battled';
        const caughtClass = statusIndex >= 2 ? 'caught active' : 'caught';
        const typesHtml = p.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
        
        return `<div class="pokedex-item clickable" data-pokemon-name-detail="${p.name}">
            <div class="flex items-center justify-between">
                <span class="text-primary font-medium">${String(p.id).padStart(3,'0')}. ${p.name}</span>
                <div class="pokedex-status-icons" data-pokemon-name="${p.name}">
                    <i class="fas fa-eye status-icon ${seenClass}" data-status="seen"></i>
                    <i class="fas fa-fist-raised status-icon ${battledClass}" data-status="battled"></i>
                    <i class="fas fa-check-circle status-icon ${caughtClass}" data-status="caught"></i>
                </div>
            </div>
            <div class="mt-2 flex gap-1.5">${typesHtml}</div>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="card">
        <input type="text" id="pokedex-search" placeholder="Search Pokémon..." value="${filter}" class="form-input mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">${items}</div>
    </div>`;
}

function renderTeamBuilder() {
    const container = document.getElementById('team-builder-view');
    // ... (existing team builder rendering logic for team slots and box)
    
    // Call the new analysis renderer
    const analysisHtml = renderTypeAnalysis();

    // The rest of the existing renderTeamBuilder logic goes here...
    const filter = container.querySelector('#box-search')?.value.toLowerCase() || '';
    const teamSlots = appState.team.map(/* ... */).join('');
    const boxItems = baseFormsToShow.filter(/* ... */).map(/* ... */).join('');

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
                <h2 class="text-3xl font-bold text-heading mb-4">My Team</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${teamSlots}</div>
            </div>
            <div>
                <h2 class="text-3xl font-bold text-heading mb-4">Pokémon Box</h2>
                <div class="card p-2">
                     <input type="text" id="box-search" placeholder="Search caught Pokémon..." value="${filter}" class="form-input mb-2">
                    <div class="max-h-80 overflow-y-auto space-y-2 p-2">${boxItems}</div>
                </div>
            </div>
        </div>
        <div class="mt-8">${analysisHtml}</div>`;
}

function renderTypeAnalysis() {
    const offensiveCoverage = {};
    const defensiveWeaknesses = {};
    const allTypes = Object.keys(TYPE_CHART);
    allTypes.forEach(t => {
        offensiveCoverage[t] = 0;
        defensiveWeaknesses[t] = 0;
    });

    appState.team.forEach(member => {
        if (member) {
            // Defensive Analysis
            const speciesData = DATA.pokedex.find(p => p.name === member.species);
            const type1 = speciesData.types[0];
            const type2 = speciesData.types[1];
            allTypes.forEach(attackingType => {
                let multiplier = 1;
                // Simplified type chart logic for brevity
                if (TYPE_CHART[type1]?.weaknesses.includes(attackingType)) multiplier *= 2;
                if (TYPE_CHART[type1]?.resistances.includes(attackingType)) multiplier *= 0.5;
                if (TYPE_CHART[type1]?.immunities.includes(attackingType)) multiplier *= 0;
                if (type2) {
                     if (TYPE_CHART[type2]?.weaknesses.includes(attackingType)) multiplier *= 2;
                     if (TYPE_CHART[type2]?.resistances.includes(attackingType)) multiplier *= 0.5;
                     if (TYPE_CHART[type2]?.immunities.includes(attackingType)) multiplier *= 0;
                }
                if (multiplier > 1) {
                    defensiveWeaknesses[attackingType]++;
                }
            });

            // Offensive Analysis
            member.moves.forEach(moveName => {
                if (moveName) {
                    const moveData = DATA.moves.find(m => m.name === moveName);
                    if (moveData) {
                        allTypes.forEach(defendingType => {
                           // Simplified: Check if move type is super-effective against defending type
                           if(TYPE_CHART[defendingType]?.weaknesses.includes(moveData.type)) {
                               offensiveCoverage[defendingType]++;
                           }
                        });
                    }
                }
            });
        }
    });
    
    const generateChart = (title, data) => {
        const items = allTypes.map(type => {
            const count = data[type];
            const isDimmed = count === 0 ? 'dimmed' : '';
            return `<div class="type-analysis-item ${isDimmed}">
                <span class="type-badge ${TYPE_COLORS[type]}">${type}</span>
                <span class="font-bold text-lg text-heading ml-2">${count}</span>
            </div>`
        }).join('');
        return `<div class="card mb-6">
            <h3 class="text-2xl font-bold text-heading mb-4">${title}</h3>
            <div class="type-analysis-grid">${items}</div>
        </div>`;
    };
    
    return generateChart('Offensive Coverage (Super-Effective)', offensiveCoverage) + generateChart('Defensive Weaknesses', defensiveWeaknesses);
}


// ... other rendering functions remain the same, just add one for sandwiches
function renderGenericList(category, title) { /* ... as before ... */ }

// --- INITIALIZATION & EVENT LISTENERS ---
function setupEventListeners() {
    // ... (existing event listeners for theme, nav, main clicks, etc)

    // Add listener for new Pokedex Detail Modal
    document.body.addEventListener('click', e => {
        const detailBtn = e.target.closest('.pokedex-item.clickable');
        if (detailBtn) {
            // Prevent status click from triggering detail view
            if (!e.target.closest('.status-icon')) {
                openPokedexDetailModal(detailBtn.dataset.pokemonNameDetail);
            }
            return;
        }
    });

    document.getElementById('detail-modal-close-btn').addEventListener('click', closePokedexDetailModal);
}

function initializeApp() {
    loadState();
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    renderView('dashboard');
    document.querySelector('.nav-btn[data-view="dashboard"]').classList.add('active');
    document.getElementById('dashboard-view').classList.add('active');
    setupEventListeners();
}

initializeApp();

