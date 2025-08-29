// --- STATE MANAGEMENT ---
let appState = {};
let currentEditingIndex = null;

const createDefaultTeamMember = (species) => ({
    species, nickname: species, level: 5, gender: 'Male', item: '', ability: '', nature: 'Hardy', metLocation: '',
    stats: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
    evs: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spatk: 31, spdef: 31, speed: 31 },
    moves: ['', '', '', ''], memories: '',
});

function loadState() {
    try {
        const savedState = localStorage.getItem('pokemonTrackerState');
        const initialState = { pokedex: {}, team: Array(6).fill(null), gyms: [], tms: [], items: [] };
        appState = savedState ? JSON.parse(savedState) : initialState;
        if (!appState.team || !Array.isArray(appState.team) || appState.team.length !== 6) {
            appState.team = Array(6).fill(null);
        }
    } catch (e) {
        console.error("Could not load or parse state, resetting.", e);
        appState = { pokedex: {}, team: Array(6).fill(null), gyms: [], tms: [], items: [] };
    }
}

function saveState() {
    localStorage.setItem('pokemonTrackerState', JSON.stringify(appState));
}

// --- CORE LOGIC & UPDATES ---
function updatePokedexStatus(pokemonName, clickedStatus) {
    const currentStatus = appState.pokedex[pokemonName];
    // If clicking the current status, clear it. Otherwise, set it to the clicked status.
    appState.pokedex[pokemonName] = currentStatus === clickedStatus ? null : clickedStatus;
    if (appState.pokedex[pokemonName] === null) delete appState.pokedex[pokemonName];
    
    saveState();
    renderPokedex();
    renderDashboard();
    renderTeamBuilder();
}

function updateCheckboxState(category, itemName, isChecked) {
    const items = new Set(appState[category] || []);
    if (isChecked) items.add(itemName); else items.delete(itemName);
    appState[category] = Array.from(items);
    saveState();
    renderDashboard();
}

function addPokemonToTeam(species) {
    const emptySlotIndex = appState.team.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
        appState.team[emptySlotIndex] = createDefaultTeamMember(species);
        saveState();
        renderTeamBuilder();
    } else {
        alert("Your team is full!");
    }
}

function handleLevelChange(teamIndex) {
    const member = appState.team[teamIndex];
    if (!member) return;
    const speciesData = DATA.pokedex.find(p => p.name === member.species);
    if (speciesData?.evolutions.length > 0) {
        const evolution = speciesData.evolutions[0];
        if (member.level >= evolution.at) {
            const oldSpecies = member.species;
            member.species = evolution.to;
            if (member.nickname === oldSpecies) member.nickname = evolution.to;
        }
    }
}

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

function savePokemonDetails() {
    if (currentEditingIndex === null) return;
    const member = appState.team[currentEditingIndex];
    member.nickname = document.getElementById('edit-nickname').value;
    member.level = parseInt(document.getElementById('edit-level').value, 10) || 1;
    member.gender = document.getElementById('edit-gender').value;
    member.item = document.getElementById('edit-item').value;
    member.ability = document.getElementById('edit-ability').value;
    member.nature = document.getElementById('edit-nature').value;
    member.metLocation = document.getElementById('edit-met-location').value;
    ['hp','atk','def','spatk','spdef','speed'].forEach(stat => {
        member.stats[stat] = document.getElementById(`edit-stat-${stat}`).value;
        member.evs[stat] = document.getElementById(`edit-ev-${stat}`).value;
        member.ivs[stat] = document.getElementById(`edit-iv-${stat}`).value;
    });
    member.moves = [1, 2, 3, 4].map(i => document.getElementById(`edit-move-${i}`).value);
    member.memories = document.getElementById('edit-memories').value;
    handleLevelChange(currentEditingIndex); // Check for evolution after level change
    saveState();
    renderTeamBuilder();
    closeEditorModal();
}

// --- RENDERING ---
function renderView(viewId) {
    const views = {
        dashboard: renderDashboard,
        pokedex: renderPokedex,
        team_builder: renderTeamBuilder,
        gyms: renderGyms,
        tms: () => renderGenericList('tms', 'TMs'),
        items: () => renderGenericList('items', 'Items')
    };
    views[viewId.replace(/-/g, '_')]();
}

const getPokemonInChain = (pokemonName) => {
    // This function now correctly finds the base form of any Pokémon in an evolution line
    let baseForm = DATA.pokedex.find(p => p.name === pokemonName);
    if (!baseForm) return [];
    
    let isBase = false;
    while (!isBase) {
        const parent = DATA.pokedex.find(p => p.evolutions.some(e => e.to === baseForm.name));
        if (parent) {
            baseForm = parent;
        } else {
            isBase = true;
        }
    }

    let chain = [baseForm];
    let current = baseForm;
    while(current.evolutions.length > 0) {
        const next = DATA.pokedex.find(p => p.name === current.evolutions[0].to);
        if(!next) break;
        chain.push(next);
        current = next;
    }
    return chain.map(p => p.name);
};


// --- View-specific render functions ---
function renderDashboard() {
    const container = document.getElementById('dashboard-view');
    const pokedexProgress = POKEDEX_STATUSES.map(status => {
        const statusIndex = POKEDEX_STATUSES.indexOf(status);
        const completed = Object.values(appState.pokedex).filter(s => s && POKEDEX_STATUSES.indexOf(s) >= statusIndex).length;
        const title = `Pokédex ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        return { id: `pokedex-${status}`, title, completed, total: DATA.pokedex.length };
    });
    const otherProgress = CATEGORIES.map(cat => ({
        id: cat.id, title: cat.title, completed: appState[cat.id]?.length || 0, total: DATA[cat.id].length
    }));
    const cards = [...pokedexProgress, ...otherProgress].map(item => {
        const percentage = item.total > 0 ? (item.completed / item.total) * 100 : 0;
        return `<div class="card">
            <h3 class="font-semibold text-lg mb-3 text-white">${item.title}</h3>
            <div class="flex justify-between items-center mb-1 text-sm text-slate-400">
                <span>Progress</span><span>${item.completed} / ${item.total}</span>
            </div>
            <div class="w-full progress-bar-bg rounded-full h-2.5"><div class="progress-bar-fill h-2.5 rounded-full" style="width: ${percentage}%"></div></div>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>`;
}

function renderPokedex() {
    const container = document.getElementById('pokedex-view');
    const filter = container.querySelector('input')?.value.toLowerCase() || '';
    const items = DATA.pokedex.filter(p => p.name.toLowerCase().includes(filter)).map(p => {
        const currentStatus = appState.pokedex[p.name];
        const statusIndex = currentStatus ? POKEDEX_STATUSES.indexOf(currentStatus) : -1;
        const seenClass = statusIndex >= 0 ? 'seen active' : 'seen';
        const battledClass = statusIndex >= 1 ? 'battled active' : 'battled';
        const caughtClass = statusIndex >= 2 ? 'caught active' : 'caught';
        
        const typesHtml = p.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
        
        return `<div class="pokedex-item">
            <div class="flex items-center justify-between">
                <span class="text-white font-medium">${p.id}. ${p.name}</span>
                <div class="pokedex-status-icons" data-pokemon-name="${p.name}">
                    <i class="fas fa-eye status-icon ${seenClass}" data-status="seen"></i>
                    <i class="fas fa-fist-raised status-icon ${battledClass}" data-status="battled"></i>
                    <i class="fas fa-circle-check status-icon ${caughtClass}" data-status="caught"></i>
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
    const filter = container.querySelector('#box-search')?.value.toLowerCase() || '';
    
    const teamSlots = appState.team.map((member, index) => {
        if (!member) return `<div class="empty-team-slot" data-index="${index}"><i class="fas fa-plus text-4xl text-slate-600"></i></div>`;
        const speciesData = DATA.pokedex.find(p => p.name === member.species);
        const typesHtml = speciesData.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
        return `<div class="team-summary-card" data-index="${index}">
            <p class="font-bold text-xl text-white">${member.nickname}</p>
            <p class="text-sm text-slate-400">Lv. ${member.level} ${member.species}</p>
            <div class="my-2 flex gap-1.5 justify-center">${typesHtml}</div>
            <p class="text-xs text-slate-500 truncate mt-2">Held Item: ${member.item || 'None'}</p>
        </div>`;
    }).join('');

    const caughtPokemonNames = Object.keys(appState.pokedex).filter(name => appState.pokedex[name] === 'caught');
    const caughtChains = new Set(caughtPokemonNames.flatMap(name => getPokemonInChain(name)));
    const baseFormsToShow = DATA.pokedex.filter(p => p.base && caughtChains.has(p.name)).map(p => p.name);
    
    const boxItems = baseFormsToShow.filter(name => name.toLowerCase().includes(filter)).map(name => `<div class="box-pokemon" data-name="${name}"><span>${name}</span><i class="fas fa-plus text-slate-400"></i></div>`).join('');

    container.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
            <h2 class="text-3xl font-bold text-white mb-4">My Team</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${teamSlots}</div>
        </div>
        <div>
            <h2 class="text-3xl font-bold text-white mb-4">Pokémon Box</h2>
            <div class="card p-2">
                 <input type="text" id="box-search" placeholder="Search caught Pokémon..." value="${filter}" class="form-input mb-2">
                <div class="max-h-80 overflow-y-auto space-y-2 p-2">${boxItems || `<p class="text-center text-slate-500">Catch Pokémon to add them!</p>`}</div>
            </div>
        </div>
    </div>`;
}

function renderGenericList(category, title) {
    const id = category.toLowerCase();
    const container = document.getElementById(`${id}-view`);
    const filter = container.querySelector('input')?.value.toLowerCase() || '';
    const items = DATA[id].filter(item => (item.name || item).toLowerCase().includes(filter)).map(item => {
        const name = item.name || item;
        const isChecked = appState[id]?.includes(name);
        return `<label class="pokedex-item flex items-center cursor-pointer">
            <input type="checkbox" data-category="${id}" data-name="${name}" class="h-5 w-5 rounded bg-slate-600 border-slate-500 text-pink-500 focus:ring-pink-500" ${isChecked ? 'checked' : ''}>
            <span class="ml-3 text-white">${item.id ? `TM${String(item.id).padStart(3, '0')}: ` : ''}${name}</span>
        </label>`;
    }).join('');
    container.innerHTML = `<div class="card">
        <input type="text" id="${id}-search" placeholder="Search ${title}..." value="${filter}" class="form-input mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">${items}</div>
    </div>`;
}

function renderGyms() {
    const container = document.getElementById('gyms-view');
    const items = DATA.gyms.map(gym => {
        const isChecked = appState.gyms?.includes(gym.name);
        return `<div class="card flex items-center">
            <input type="checkbox" data-category="gyms" data-name="${gym.name}" class="h-6 w-6 rounded bg-slate-600 border-slate-500 text-pink-500 focus:ring-pink-500" ${isChecked ? 'checked' : ''}>
            <div class="ml-4 flex-grow">
                <h4 class="font-bold text-lg text-white">${gym.name}</h4>
                <p class="text-slate-400">${gym.leader}</p>
            </div>
            <span class="gym-type type-badge ${TYPE_COLORS[gym.type]}">${gym.type}</span>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${items}</div>`;
}

function renderPokemonEditor() {
    const member = appState.team[currentEditingIndex];
    if (!member) return;

    const itemOptions = '<option value="">None</option>' + DATA.items.map(i => `<option value="${i}">${i}</option>`).join('');
    const moveOptions = '<option value="">-</option>' + DATA.moves.map(m => `<option value="${m}">${m}</option>`).join('');
    
    document.getElementById('summary-tab').innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="form-label">Nickname</label><input type="text" id="edit-nickname" class="form-input" value="${member.nickname}"></div>
        <div><label class="form-label">Species</label><input type="text" class="form-input bg-slate-800" value="${member.species}" disabled></div>
        <div><label class="form-label">Gender</label><select id="edit-gender" class="form-input"><option>Male</option><option>Female</option><option>Genderless</option></select></div>
        <div><label class="form-label">Level</label><input type="number" id="edit-level" min="1" max="100" class="form-input" value="${member.level}"></div>
        <div><label class="form-label">Held Item</label><select id="edit-item" class="form-input">${itemOptions}</select></div>
        <div><label class="form-label">Ability</label><input type="text" id="edit-ability" class="form-input" value="${member.ability}"></div>
        <div><label class="form-label">Nature</label><input type="text" id="edit-nature" class="form-input" value="${member.nature}"></div>
        <div><label class="form-label">Met Location</label><input type="text" id="edit-met-location" class="form-input" value="${member.metLocation}"></div>
    </div>`;
    
    const statsInputs = ['hp','atk','def','spatk','spdef','speed'].map(stat => `
        <label>${stat.toUpperCase()}</label>
        <input type="number" id="edit-stat-${stat}" class="form-input form-input-sm" value="${member.stats[stat]}" placeholder="Base">
        <input type="number" id="edit-ev-${stat}" class="form-input form-input-sm" value="${member.evs[stat]}" placeholder="EVs">
        <input type="number" id="edit-iv-${stat}" class="form-input form-input-sm" value="${member.ivs[stat]}" placeholder="IVs">
    `).join('');

    document.getElementById('stats-tab').innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h4 class="font-semibold mb-2 text-white">Stats</h4>
            <div class="grid grid-cols-4 gap-2 text-sm items-center text-slate-400">
                <span></span><span class="font-medium">Base</span><span class="font-medium">EVs</span><span class="font-medium">IVs</span>
                ${statsInputs}
            </div>
        </div>
        <div>
            <h4 class="font-semibold mb-2 text-white">Moves</h4>
            <div class="space-y-2">
                <select class="form-input" id="edit-move-1">${moveOptions}</select>
                <select class="form-input" id="edit-move-2">${moveOptions}</select>
                <select class="form-input" id="edit-move-3">${moveOptions}</select>
                <select class="form-input" id="edit-move-4">${moveOptions}</select>
            </div>
        </div>
    </div>`;

    document.getElementById('memories-tab').innerHTML = `
        <label class="form-label">Write down your memories with this Pokémon!</label>
        <textarea id="edit-memories" class="form-input" rows="6" placeholder="Met on Route 1...">${member.memories}</textarea>
    `;

    // Now set the values for selects and other complex fields
    document.getElementById('edit-gender').value = member.gender;
    document.getElementById('edit-item').value = member.item;
    for(let i=0; i<4; i++) {
        document.getElementById(`edit-move-${i+1}`).value = member.moves[i];
    }
}

// --- INITIALIZATION & EVENT LISTENERS ---
function setupEventListeners() {
    const mainContent = document.getElementById('main-content');
    const modal = document.getElementById('pokemon-editor-modal');

    // Main navigation and content area clicks
    document.body.addEventListener('click', e => {
        const navBtn = e.target.closest('.nav-btn');
        if (navBtn) {
            document.querySelectorAll('.nav-btn, .view').forEach(el => el.classList.remove('active'));
            navBtn.classList.add('active');
            const targetView = document.getElementById(`${navBtn.dataset.view}-view`);
            targetView.classList.add('active');
            renderView(navBtn.dataset.view);
            return;
        }

        const statusIcon = e.target.closest('.status-icon');
        if (statusIcon) {
            updatePokedexStatus(statusIcon.parentElement.dataset.pokemonName, statusIcon.dataset.status);
            return;
        }

        const teamCard = e.target.closest('.team-summary-card, .empty-team-slot');
        if (teamCard) {
            const index = parseInt(teamCard.dataset.index);
            if (appState.team[index] || appState.team[index] === null) openEditorModal(index);
            else document.getElementById('box-search')?.focus();
            return;
        }
        
        const boxMon = e.target.closest('.box-pokemon');
        if (boxMon) {
            addPokemonToTeam(boxMon.dataset.name);
            return;
        }
    });

    // Modal-specific clicks
    modal.addEventListener('click', e => {
        if (e.target.closest('#modal-close-btn')) closeEditorModal();
        if (e.target.closest('#modal-save-btn')) savePokemonDetails();
        
        const modalTab = e.target.closest('.modal-tab');
        if (modalTab) {
            modal.querySelectorAll('.modal-tab, .modal-tab-pane').forEach(el => el.classList.remove('active'));
            modalTab.classList.add('active');
            modal.querySelector(`#${modalTab.dataset.tab}-tab`).classList.add('active');
        }
    });

    // Input and Change events
    mainContent.addEventListener('change', e => {
        if (e.target.type === 'checkbox') {
            updateCheckboxState(e.target.dataset.category, e.target.dataset.name, e.target.checked);
        }
    });
    
    mainContent.addEventListener('input', e => {
        const targetId = e.target.id;
        if (targetId === 'pokedex-search') renderPokedex();
        else if (targetId === 'box-search') renderTeamBuilder();
        else if (targetId === 'tms-search') renderGenericList('tms', 'TMs');
        else if (targetId === 'items-search') renderGenericList('items', 'Items');
    });
}

function initializeApp() {
    loadState();
    renderView('dashboard');
    setupEventListeners();
}

initializeApp();

