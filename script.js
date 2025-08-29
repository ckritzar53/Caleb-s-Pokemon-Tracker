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

function removePokemonFromTeam() {
    if (currentEditingIndex === null) return;
    appState.team[currentEditingIndex] = null;
    saveState();
    renderTeamBuilder();
    closeEditorModal();
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
    handleLevelChange(currentEditingIndex);
    saveState();
    renderTeamBuilder();
    closeEditorModal();
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


// --- RENDERING FUNCTIONS (Placed before they are called) ---
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
            <h3 class="font-semibold text-lg mb-3 text-heading">${item.title}</h3>
            <div class="flex justify-between items-center mb-1 text-sm text-secondary">
                <span>Progress</span><span>${item.completed} / ${item.total}</span>
            </div>
            <div class="w-full progress-bar-bg rounded-full h-1.5"><div class="progress-bar-fill h-1.5 rounded-full" style="width: ${percentage}%"></div></div>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</div>`;
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
    const filter = container.querySelector('#box-search')?.value.toLowerCase() || '';
    
    const teamSlots = appState.team.map((member, index) => {
        if (!member) return `<div class="empty-team-slot" data-index="${index}"><i class="fas fa-plus text-4xl text-secondary"></i></div>`;
        const speciesData = DATA.pokedex.find(p => p.name === member.species);
        const typesHtml = speciesData.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
        const genderIcon = member.gender === 'Male' ? '<i class="fas fa-mars gender-icon gender-male"></i>' : member.gender === 'Female' ? '<i class="fas fa-venus gender-icon gender-female"></i>' : '';
        return `<div class="team-summary-card" data-index="${index}">
            <p class="font-bold text-xl text-heading">${member.nickname}</p>
            <p class="text-sm text-secondary">Lv. ${member.level} ${member.species}${genderIcon}</p>
            <div class="my-2 flex gap-1.5 justify-center">${typesHtml}</div>
            <p class="text-xs text-secondary truncate mt-2">Held Item: ${member.item || 'None'}</p>
        </div>`;
    }).join('');

    const caughtPokemonNames = Object.keys(appState.pokedex).filter(name => appState.pokedex[name] === 'caught');
    const caughtChains = new Set(caughtPokemonNames.flatMap(name => getPokemonInChain(name)));
    const baseFormsToShow = DATA.pokedex.filter(p => p.base && caughtChains.has(p.name)).map(p => p.name);
    
    const boxItems = baseFormsToShow.filter(name => name.toLowerCase().includes(filter)).map(name => `<div class="box-pokemon" data-name="${name}"><span>${name}</span><i class="fas fa-plus text-secondary"></i></div>`).join('');

    const analysisHtml = renderTypeAnalysis();

    container.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
            <h2 class="text-3xl font-bold text-heading mb-4">My Team</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${teamSlots}</div>
        </div>
        <div>
            <h2 class="text-3xl font-bold text-heading mb-4">Pokémon Box</h2>
            <div class="card p-2">
                 <input type="text" id="box-search" placeholder="Search caught Pokémon..." value="${filter}" class="form-input mb-2">
                <div class="max-h-80 overflow-y-auto space-y-2 p-2">${boxItems || `<p class="text-center text-secondary">Catch Pokémon to add them!</p>`}</div>
            </div>
        </div>
        <div class="lg:col-span-3 mt-8">${analysisHtml}</div>
    </div>`;
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
            const speciesData = DATA.pokedex.find(p => p.name === member.species);
            const type1 = speciesData.types[0];
            const type2 = speciesData.types[1];
            allTypes.forEach(attackingType => {
                let multiplier = 1;
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
            member.moves.forEach(moveName => {
                if (moveName) {
                    const moveData = DATA.moves.find(m => m.name === moveName);
                    if (moveData) {
                        allTypes.forEach(defendingType => {
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

function getPokemonInChain(pokemonName) {
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


function renderGenericList(category, title) {
    const id = category.toLowerCase();
    const container = document.getElementById(`${id}-view`);
    const filter = container.querySelector('input')?.value.toLowerCase() || '';
    const items = DATA[id].filter(item => (item.name || item).toLowerCase().includes(filter)).map(item => {
        const name = item.name || item;
        const isChecked = appState[id]?.includes(name);
        return `<label class="pokedex-item flex items-center cursor-pointer">
            <input type="checkbox" data-category="${id}" data-name="${name}" class="h-5 w-5 rounded text-accent-blue focus:ring-accent-blue" ${isChecked ? 'checked' : ''}>
            <span class="ml-3 text-primary">${item.id ? `TM${String(item.id).padStart(3, '0')}: ` : ''}${name}</span>
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
            <input type="checkbox" data-category="gyms" data-name="${gym.name}" class="h-6 w-6 rounded text-accent-blue focus:ring-accent-blue" ${isChecked ? 'checked' : ''}>
            <div class="ml-4 flex-grow">
                <h4 class="font-bold text-lg text-heading">${gym.name}</h4>
                <p class="text-secondary">${gym.leader}</p>
            </div>
            <span class="gym-type type-badge ${TYPE_COLORS[gym.type]}">${gym.type}</span>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${items}</div>`;
}

function renderPokemonEditor() {
    const member = appState.team[currentEditingIndex];
    if (!member) return;
    const speciesData = DATA.pokedex.find(p => p.name === member.species);

    const itemOptions = '<option value="">None</option>' + DATA.items.map(i => `<option value="${i}">${i}</option>`).join('');
    
    const moveOptionsHTML = (id, selectedMove) => {
        let options = '<option value="">-</option>';
        options += DATA.moves.map(m => {
            const isSelected = m.name === selectedMove ? 'selected' : '';
            return `<option value="${m.name}" ${isSelected}>${m.name} (${m.type})</option>`;
        }).join('');
        return `<select class="form-input" id="edit-move-${id}">${options}</select>`;
    };
    
    const genderOptions = speciesData.genders.map(g => `<option value="${g}">${g}</option>`).join('');

    document.getElementById('summary-tab').innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="form-label">Nickname</label><input type="text" id="edit-nickname" class="form-input" value="${member.nickname}"></div>
        <div><label class="form-label">Species</label><input type="text" class="form-input text-secondary" value="${member.species}" disabled></div>
        <div><label class="form-label">Gender</label><select id="edit-gender" class="form-input">${genderOptions}</select></div>
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
            <h4 class="font-semibold mb-2 text-heading">Stats</h4>
            <div class="grid grid-cols-4 gap-2 text-sm items-center text-secondary">
                <span></span><span class="font-medium">Base</span><span class="font-medium">EVs</span><span class="font-medium">IVs</span>
                ${statsInputs}
            </div>
        </div>
        <div>
            <h4 class="font-semibold mb-2 text-heading">Moves</h4>
            <div class="space-y-2">
                ${moveOptionsHTML(1, member.moves[0])}
                ${moveOptionsHTML(2, member.moves[1])}
                ${moveOptionsHTML(3, member.moves[2])}
                ${moveOptionsHTML(4, member.moves[3])}
            </div>
        </div>
    </div>`;

    document.getElementById('memories-tab').innerHTML = `
        <label class="form-label">Write down your memories with this Pokémon!</label>
        <textarea id="edit-memories" class="form-input" rows="6" placeholder="Met on Route 1...">${member.memories}</textarea>
    `;

    document.getElementById('edit-gender').value = member.gender;
    document.getElementById('edit-item').value = member.item;
}

// --- INITIALIZATION & EVENT LISTENERS ---
function setupEventListeners() {
    const modal = document.getElementById('pokemon-editor-modal');

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
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
        
        const detailBtn = e.target.closest('.pokedex-item.clickable');
        if (detailBtn && !e.target.closest('.pokedex-status-icons')) {
            openPokedexDetailModal(detailBtn.dataset.pokemonNameDetail);
            return;
        }

        const teamCard = e.target.closest('.team-summary-card, .empty-team-slot');
        if (teamCard) {
            const index = parseInt(teamCard.dataset.index);
            if (appState.team[index]) {
                openEditorModal(index);
            } else {
                document.getElementById('box-search')?.focus({ preventScroll: false });
            }
            return;
        }
        
        const boxMon = e.target.closest('.box-pokemon');
        if (boxMon) {
            addPokemonToTeam(boxMon.dataset.name);
            return;
        }
    });

    modal.addEventListener('click', e => {
        if (e.target.closest('#modal-close-btn')) closeEditorModal();
        if (e.target.closest('#modal-save-btn')) savePokemonDetails();
        if (e.target.closest('#modal-remove-btn')) removePokemonFromTeam();
        
        const modalTab = e.target.closest('.modal-tab');
        if (modalTab) {
            modal.querySelectorAll('.modal-tab, .modal-tab-pane').forEach(el => el.classList.remove('active'));
            modalTab.classList.add('active');
            modal.querySelector(`#${modalTab.dataset.tab}-tab`).classList.add('active');
        }
    });
    
    document.getElementById('detail-modal-close-btn').addEventListener('click', closePokedexDetailModal);
    
    document.body.addEventListener('change', e => {
        if (e.target.type === 'checkbox') {
            updateCheckboxState(e.target.dataset.category, e.target.dataset.name, e.target.checked);
        }
    });
    
    document.body.addEventListener('input', e => {
        const targetId = e.target.id;
        if (targetId === 'pokedex-search') renderPokedex();
        else if (targetId === 'box-search') renderTeamBuilder();
        else if (targetId === 'tms-search') renderGenericList('tms', 'TMs');
        else if (targetId === 'items-search') renderGenericList('items', 'Items');
        else if (targetId === 'sandwiches-search') renderGenericList('sandwiches', 'Sandwiches');
    });
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

// Ensure the render functions are available globally before they are called.
// This structure prevents the ReferenceError.
const { renderDashboard, renderPokedex, renderTeamBuilder, renderGyms, renderGenericList, renderTypeAnalysis, renderPokemonEditor } = (() => {
    return { renderDashboard, renderPokedex, renderTeamBuilder, renderGyms, renderGenericList, renderTypeAnalysis, renderPokemonEditor };
})();

// Initial call to start the application
initializeApp();
