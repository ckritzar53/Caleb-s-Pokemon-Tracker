// --- STATE MANAGEMENT ---
let appState = {};
let currentEditingIndex = null;

const createDefaultTeamMember = (species) => ({
    species,
    nickname: species,
    level: 5,
    gender: 'Male',
    item: '',
    ability: '',
    nature: 'Hardy',
    metLocation: '',
    stats: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
    evs: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spatk: 31, spdef: 31, speed: 31 },
    moves: ['', '', '', ''],
    memories: '',
});

function loadState() {
    try {
        const savedState = localStorage.getItem('pokemonTrackerState');
        if (savedState) {
            appState = JSON.parse(savedState);
            if (!appState.team || !Array.isArray(appState.team) || appState.team.length !== 6) {
                appState.team = Array(6).fill(null);
            }
        } else {
            appState = { pokedex: {}, team: Array(6).fill(null), gyms: [], tms: [], items: [] };
        }
    } catch (e) {
        console.error("Could not load state:", e);
        appState = { pokedex: {}, team: Array(6).fill(null), gyms: [], tms: [], items: [] };
    }
}

function saveState() {
    localStorage.setItem('pokemonTrackerState', JSON.stringify(appState));
}

// --- CORE LOGIC & UPDATES ---
function updatePokedexStatus(pokemonName, status) {
    if (appState.pokedex[pokemonName] === status) {
        delete appState.pokedex[pokemonName];
    } else {
        appState.pokedex[pokemonName] = status;
    }
    saveState();
    renderPokedex(document.getElementById('pokedex-search').value);
    updateDashboard();
    renderTeamBuilder(document.getElementById('box-search').value); 
}

function updateCheckboxState(category, itemName, isChecked) {
    const items = new Set(appState[category] || []);
    if (isChecked) { items.add(itemName); } else { items.delete(itemName); }
    appState[category] = Array.from(items);
    saveState();
    updateDashboard();
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

function handleLevelChange(teamIndex, newLevel) {
    const member = appState.team[teamIndex];
    if (!member) return;
    member.level = newLevel;
    const speciesData = DATA.pokedex.find(p => p.name === member.species);
    if (speciesData?.evolutions.length > 0) {
        const evolution = speciesData.evolutions[0];
        if (member.level >= evolution.at) {
            member.species = evolution.to;
            if (member.nickname === speciesData.name) {
                member.nickname = evolution.to;
            }
        }
    }
}

// --- MODAL HANDLING ---
function openEditorModal(teamIndex) {
    currentEditingIndex = teamIndex;
    populateEditorModal(teamIndex);
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
    
    const newLevel = parseInt(document.getElementById('edit-level').value, 10);
    handleLevelChange(currentEditingIndex, newLevel);
    
    saveState();
    renderTeamBuilder();
    closeEditorModal();
}

function populateEditorModal(teamIndex) {
    const member = appState.team[teamIndex];
    if (!member) return;
    
    document.getElementById('edit-nickname').value = member.nickname;
    document.getElementById('edit-species').value = member.species;
    document.getElementById('edit-gender').value = member.gender;
    document.getElementById('edit-level').value = member.level;
    document.getElementById('edit-ability').value = member.ability;
    document.getElementById('edit-nature').value = member.nature;
    document.getElementById('edit-met-location').value = member.metLocation;

    const itemSelect = document.getElementById('edit-item');
    itemSelect.innerHTML = '<option value="">None</option>' + DATA.items.map(i => `<option value="${i}">${i}</option>`).join('');
    itemSelect.value = member.item;

    ['hp','atk','def','spatk','spdef','speed'].forEach(stat => {
        document.getElementById(`edit-stat-${stat}`).value = member.stats[stat];
        document.getElementById(`edit-ev-${stat}`).value = member.evs[stat];
        document.getElementById(`edit-iv-${stat}`).value = member.ivs[stat];
    });

    for (let i = 1; i <= 4; i++) {
        const moveSelect = document.getElementById(`edit-move-${i}`);
        moveSelect.innerHTML = '<option value="">-</option>' + DATA.moves.map(m => `<option value="${m}">${m}</option>`).join('');
        moveSelect.value = member.moves[i-1];
    }
    document.getElementById('edit-memories').value = member.memories;
}

// --- RENDERING ---
function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    grid.innerHTML = '';
    const pokedexProgress = POKEDEX_STATUSES.map(status => {
        const completed = Object.values(appState.pokedex).filter(s => POKEDEX_STATUSES.indexOf(s) >= POKEDEX_STATUSES.indexOf(status)).length;
        const title = `Pokédex ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        return { id: `pokedex-${status}`, title, completed, total: DATA.pokedex.length };
    });
    const otherProgress = CATEGORIES.map(cat => ({
        id: cat.id, title: cat.title, completed: appState[cat.id]?.length || 0, total: DATA[cat.id].length
    }));
    [...pokedexProgress, ...otherProgress].forEach(item => {
        const percentage = item.total > 0 ? (item.completed / item.total) * 100 : 0;
        grid.innerHTML += createProgressCard(item.id, item.title, item.completed, item.total, percentage);
    });
}

function createProgressCard(id, title, completed, total, percentage) {
    return `
        <div class="bg-white p-5 rounded-xl shadow-sm">
            <h3 class="font-semibold text-lg mb-3 text-gray-800">${title}</h3>
            <div class="flex justify-between items-center mb-1 text-sm text-gray-500">
                <span>Progress</span><span id="${id}-progress-text">${completed} / ${total}</span>
            </div>
            <div class="w-full progress-bar-bg rounded-full h-2"><div id="${id}-progress-bar" class="progress-bar-fill h-2 rounded-full" style="width: ${percentage}%"></div></div>
        </div>`;
}

function updateDashboard() {
    // This is implicitly handled by re-rendering the whole dashboard, but a more performant version would update text/styles directly.
    renderDashboard();
}

function renderPokedex(filter = '') {
    const grid = document.getElementById('pokedex-grid');
    grid.innerHTML = '';
    const lowercasedFilter = filter.toLowerCase();
    DATA.pokedex.filter(p => p.name.toLowerCase().includes(lowercasedFilter)).forEach(p => {
        const currentStatus = appState.pokedex[p.name];
        const statusClasses = POKEDEX_STATUSES.map((s, i) => currentStatus && POKEDEX_STATUSES.indexOf(currentStatus) >= i ? 'active' : '').join(' ');
        const typesHtml = p.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
        grid.innerHTML += `
            <div class="bg-white p-3 rounded-lg border border-gray-200">
                <div class="flex items-center justify-between">
                    <span class="text-gray-700 font-medium">${p.id}. ${p.name}</span>
                    <div class="pokedex-status-icons" data-pokemon-name="${p.name}">
                        <i class="fas fa-eye status-icon seen ${statusClasses.includes('seen') ? 'active' : ''}" data-status="seen"></i>
                        <i class="fas fa-fist-raised status-icon battled ${statusClasses.includes('battled') ? 'active' : ''}" data-status="battled"></i>
                        <i class="fas fa-circle-check status-icon caught ${statusClasses.includes('caught') ? 'active' : ''}" data-status="caught"></i>
                    </div>
                </div>
                <div class="mt-2 flex gap-1">${typesHtml}</div>
            </div>`;
    });
}

function renderTeamBuilder(filter = '') {
    const teamGrid = document.getElementById('team-slots-grid');
    const boxGrid = document.getElementById('pokemon-box-grid');
    teamGrid.innerHTML = '';
    boxGrid.innerHTML = '';

    appState.team.forEach((member, index) => {
        if (member) {
            const speciesData = DATA.pokedex.find(p => p.name === member.species);
            const typesHtml = speciesData.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
            teamGrid.innerHTML += `
                <div class="team-summary-card" data-index="${index}">
                    <p class="font-bold text-lg">${member.nickname}</p>
                    <p class="text-sm text-gray-500">Lv. ${member.level} ${member.species}</p>
                    <div class="my-2 flex gap-1 justify-center">${typesHtml}</div>
                    <p class="text-xs text-gray-400 truncate">Item: ${member.item || 'None'}</p>
                </div>`;
        } else {
            teamGrid.innerHTML += `<div class="empty-team-slot" data-index="${index}"><i class="fas fa-plus text-3xl text-gray-300"></i></div>`;
        }
    });

    const caughtBasePokemon = DATA.pokedex.filter(p => p.base && Object.keys(appState.pokedex).some(caughtName => {
        let current = DATA.pokedex.find(pk => pk.name === caughtName);
        while (current) {
            if (current.name === p.name) return true;
            const prev = DATA.pokedex.find(pk => pk.evolutions.some(e => e.to === current.name));
            current = prev;
        }
        return false;
    })).map(p => p.name);

    const lowercasedFilter = filter.toLowerCase();
    caughtBasePokemon.filter(name => name.toLowerCase().includes(lowercasedFilter) && !appState.team.some(m => m && m.nickname === name)).forEach(name => {
        boxGrid.innerHTML += `<div class="box-pokemon" data-name="${name}"><span>${name}</span></div>`;
    });
}

function renderGenericList(category, gridId, filter = '') {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    const lowercasedFilter = filter.toLowerCase();
    DATA[category].filter(item => (item.name || item).toLowerCase().includes(lowercasedFilter)).forEach(item => {
        const name = item.name || item;
        const id = item.id || null;
        const isChecked = appState[category]?.includes(name) || false;
        grid.innerHTML += `<label class="list-item-container"><input type="checkbox" data-category="${category}" data-name="${name}" class="checkbox-style" ${isChecked ? 'checked' : ''}><span class="ml-3 text-gray-700">${id ? `TM${String(id).padStart(3, '0')}: ` : ''}${name}</span></label>`;
    });
}

function renderGyms() {
    const grid = document.getElementById('gyms-grid');
    grid.innerHTML = '';
    DATA.gyms.forEach(gym => {
        const isChecked = appState.gyms?.includes(gym.name) || false;
        grid.innerHTML += `<div class="gym-card"><input type="checkbox" data-category="gyms" data-name="${gym.name}" class="checkbox-style flex-shrink-0" ${isChecked ? 'checked' : ''}><div class="gym-info"><h4 class="font-bold text-lg text-gray-800">${gym.name}</h4><p class="text-gray-500">${gym.leader}</p><span class="gym-type ${TYPE_COLORS[gym.type]}">${gym.type}</span></div></div>`;
    });
}

// --- INITIALIZATION & EVENT LISTENERS ---
function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.view, .nav-btn').forEach(el => el.classList.remove('active'));
            document.getElementById(`${button.dataset.view}-view`).classList.add('active');
            button.classList.add('active');
        });
    });

    const mainElement = document.querySelector('main');
    mainElement.addEventListener('click', e => {
        const statusIcon = e.target.closest('.status-icon');
        if (statusIcon) updatePokedexStatus(statusIcon.parentElement.dataset.pokemonName, statusIcon.dataset.status);
    });
    mainElement.addEventListener('change', e => {
        if (e.target.type === 'checkbox') updateCheckboxState(e.target.dataset.category, e.target.dataset.name, e.target.checked);
    });

    document.getElementById('team-builder-view').addEventListener('click', e => {
        const card = e.target.closest('.team-summary-card, .empty-team-slot');
        if (card) {
            const index = parseInt(card.dataset.index);
            const member = appState.team[index];
            if (member) openEditorModal(index);
            else document.getElementById('box-search').focus();
        }
        const boxMon = e.target.closest('.box-pokemon');
        if(boxMon) addPokemonToTeam(boxMon.dataset.name);
    });

    document.getElementById('modal-close-btn').addEventListener('click', closeEditorModal);
    document.getElementById('modal-save-btn').addEventListener('click', savePokemonDetails);
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.modal-tab, .modal-tab-pane').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
    
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
    renderTeamBuilder();
    setupEventListeners();
}

initializeApp();

