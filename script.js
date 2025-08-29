// --- STATE MANAGEMENT ---
let appState = {};
let currentEditingIndex = null;

// Default structure for a new team member
const createDefaultTeamMember = (species) => ({
    species,
    nickname: species,
    level: 5,
    gender: 'Male',
    item: '',
    ability: '',
    nature: '',
    metLocation: '',
    stats: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
    evs: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, speed: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spatk: 31, spdef: 31, speed: 31 },
    moves: ['', '', '', ''],
    memories: '',
});

function loadState() {
    const savedState = localStorage.getItem('pokemonTrackerState');
    if (savedState) {
        appState = JSON.parse(savedState);
        if (!appState.team || appState.team.length !== 6) {
            appState.team = Array(6).fill(null);
        }
    } else {
        appState = {
            pokedex: {},
            team: Array(6).fill(null),
            gyms: [],
            tms: [],
            items: [],
        };
    }
}

function saveState() {
    localStorage.setItem('pokemonTrackerState', JSON.stringify(appState));
}

// --- CORE LOGIC ---
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
    
    if (speciesData && speciesData.evolutions.length > 0) {
        const evolution = speciesData.evolutions[0];
        if (member.level >= evolution.at) {
            member.species = evolution.to;
            // If nickname was the same as the old species, update it
            if (member.nickname === speciesData.name) {
                member.nickname = evolution.to;
            }
        }
    }
    saveState();
    // Re-render modal if open to show new species name, and team to show summary
    if(document.getElementById('pokemon-editor-modal').classList.contains('hidden') === false) {
        populateEditorModal(teamIndex);
    }
    renderTeamBuilder();
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
    
    // Summary
    member.nickname = document.getElementById('edit-nickname').value;
    member.gender = document.getElementById('edit-gender').value;
    member.item = document.getElementById('edit-item').value;
    member.ability = document.getElementById('edit-ability').value;
    member.nature = document.getElementById('edit-nature').value;
    member.metLocation = document.getElementById('edit-met-location').value;
    
    // Stats
    ['hp','atk','def','spatk','spdef','speed'].forEach(stat => {
        member.stats[stat] = document.getElementById(`edit-stat-${stat}`).value;
        member.evs[stat] = document.getElementById(`edit-ev-${stat}`).value;
        member.ivs[stat] = document.getElementById(`edit-iv-${stat}`).value;
    });

    // Moves
    member.moves = [
        document.getElementById('edit-move-1').value,
        document.getElementById('edit-move-2').value,
        document.getElementById('edit-move-3').value,
        document.getElementById('edit-move-4').value,
    ];

    // Memories
    member.memories = document.getElementById('edit-memories').value;
    
    // Handle level change separately for evolution logic
    const newLevel = parseInt(document.getElementById('edit-level').value, 10);
    handleLevelChange(currentEditingIndex, newLevel);
    
    saveState();
    renderTeamBuilder();
    closeEditorModal();
}

function populateEditorModal(teamIndex) {
    const member = appState.team[teamIndex];
    if (!member) return;
    
    // Populate Summary
    document.getElementById('edit-nickname').value = member.nickname;
    document.getElementById('edit-species').value = member.species;
    document.getElementById('edit-gender').value = member.gender;
    document.getElementById('edit-level').value = member.level;
    document.getElementById('edit-ability').value = member.ability;
    document.getElementById('edit-nature').value = member.nature;
    document.getElementById('edit-met-location').value = member.metLocation;

    // Populate Items Dropdown
    const itemSelect = document.getElementById('edit-item');
    itemSelect.innerHTML = '<option value="">None</option>' + DATA.items.map(i => `<option value="${i}">${i}</option>`).join('');
    itemSelect.value = member.item;

    // Populate Stats
    ['hp','atk','def','spatk','spdef','speed'].forEach(stat => {
        document.getElementById(`edit-stat-${stat}`).value = member.stats[stat];
        document.getElementById(`edit-ev-${stat}`).value = member.evs[stat];
        document.getElementById(`edit-iv-${stat}`).value = member.ivs[stat];
    });

    // Populate Moves Dropdowns
    for (let i = 1; i <= 4; i++) {
        const moveSelect = document.getElementById(`edit-move-${i}`);
        moveSelect.innerHTML = '<option value="">-</option>' + DATA.moves.map(m => `<option value="${m}">${m}</option>`).join('');
        moveSelect.value = member.moves[i-1];
    }

    // Populate Memories
    document.getElementById('edit-memories').value = member.memories;
}

// --- RENDERING --- (Simplified for brevity, full logic in previous steps)
function renderTeamBuilder(filter = '') {
    const teamGrid = document.getElementById('team-slots-grid');
    const boxGrid = document.getElementById('pokemon-box-grid');
    teamGrid.innerHTML = '';
    boxGrid.innerHTML = '';

    // Render team
    appState.team.forEach((member, index) => {
        if (member) {
            const speciesData = DATA.pokedex.find(p => p.name === member.species);
            const typesHtml = speciesData.types.map(type => `<span class="type-badge ${TYPE_COLORS[type]}">${type}</span>`).join(' ');
            teamGrid.innerHTML += `
                <div class="team-summary-card" data-index="${index}">
                    <p class="font-bold text-lg">${member.nickname}</p>
                    <p class="text-sm text-gray-500">Lv. ${member.level}</p>
                    <div class="my-2 flex gap-1 justify-center">${typesHtml}</div>
                    <p class="text-xs text-gray-400 truncate">Item: ${member.item || 'None'}</p>
                </div>`;
        } else {
            teamGrid.innerHTML += `<div class="empty-team-slot" data-index="${index}"><i class="fas fa-plus text-3xl text-gray-300"></i></div>`;
        }
    });

    // Render Box (with smart filtering)
    const caughtBasePokemon = DATA.pokedex
        .filter(p => p.base && appState.pokedex[p.name] === 'caught')
        .map(p => p.name);
    
    const lowercasedFilter = filter.toLowerCase();
    caughtBasePokemon
        .filter(name => name.toLowerCase().includes(lowercasedFilter))
        .forEach(name => {
            boxGrid.innerHTML += `<div class="box-pokemon" data-name="${name}"><span>${name}</span></div>`;
    });
}

// Placeholder for other rendering functions
function renderDashboard() { /* Unchanged */ }
function renderPokedex(filter='') { /* Unchanged */ }
function renderGyms() { /* Unchanged */ }
function renderGenericList(category, gridId, filter = '') { /* Unchanged */ }

// --- INITIALIZATION & EVENT LISTENERS ---
function initializeApp() {
    loadState();
    // Render all views initially (simplified)
    document.getElementById('dashboard-view').innerHTML = "Dashboard content...";
    // ... setup for all other views ...
    renderTeamBuilder();
    setupEventListeners();
}

function setupEventListeners() {
    // Main navigation
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Tab switching logic here
        });
    });

    // Team builder clicks
    document.getElementById('team-builder-view').addEventListener('click', e => {
        const card = e.target.closest('.team-summary-card, .empty-team-slot');
        if (card) {
            const index = parseInt(card.dataset.index);
            const member = appState.team[index];
            if (member) {
                openEditorModal(index);
            } else {
                document.getElementById('box-search').focus();
            }
        }
        
        const boxMon = e.target.closest('.box-pokemon');
        if(boxMon) {
            addPokemonToTeam(boxMon.dataset.name);
        }
    });

    // Modal listeners
    document.getElementById('modal-close-btn').addEventListener('click', closeEditorModal);
    document.getElementById('modal-save-btn').addEventListener('click', savePokemonDetails);
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.modal-tab, .modal-tab-pane').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
}

initializeApp();

