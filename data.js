const POKEDEX_STATUSES = ['seen', 'battled', 'caught'];
const CATEGORIES = [
    { id: 'gyms', title: 'Gyms Completed' },
    { id: 'tms', title: 'TMs Collected' },
    { id: 'items', title: 'Items Collected' },
    { id: 'sandwiches', title: 'Sandwiches Made' }
];

const TYPE_COLORS = {
    Normal: 'bg-gray-400 text-black',
    Fire: 'bg-orange-500 text-white',
    Water: 'bg-blue-500 text-white',
    Grass: 'bg-green-500 text-white',
    Electric: 'bg-yellow-400 text-black',
    Ice: 'bg-cyan-300 text-black',
    Fighting: 'bg-red-700 text-white',
    Poison: 'bg-purple-600 text-white',
    Ground: 'bg-yellow-600 text-white',
    Flying: 'bg-indigo-400 text-white',
    Psychic: 'bg-pink-500 text-white',
    Bug: 'bg-lime-500 text-black',
    Rock: 'bg-yellow-700 text-white',
    Ghost: 'bg-indigo-800 text-white',
    Dragon: 'bg-indigo-600 text-white',
    Dark: 'bg-gray-800 text-white',
    Steel: 'bg-gray-500 text-white',
    Fairy: 'bg-pink-300 text-black',
};

const TYPE_CHART = {
    Normal: { weaknesses: ['Fighting'], resistances: [], immunities: ['Ghost'] },
    Fire: { weaknesses: ['Water', 'Ground', 'Rock'], resistances: ['Fire', 'Grass', 'Ice', 'Bug', 'Steel', 'Fairy'], immunities: [] },
    Water: { weaknesses: ['Grass', 'Electric'], resistances: ['Fire', 'Water', 'Ice', 'Steel'], immunities: [] },
    Grass: { weaknesses: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'], resistances: ['Water', 'Grass', 'Electric', 'Ground'], immunities: [] },
    Electric: { weaknesses: ['Ground'], resistances: ['Electric', 'Flying', 'Steel'], immunities: [] },
    Ice: { weaknesses: ['Fire', 'Fighting', 'Rock', 'Steel'], resistances: ['Ice'], immunities: [] },
    Fighting: { weaknesses: ['Flying', 'Psychic', 'Fairy'], resistances: ['Bug', 'Rock', 'Dark'], immunities: [] },
    Poison: { weaknesses: ['Ground', 'Psychic'], resistances: ['Grass', 'Fighting', 'Poison', 'Bug', 'Fairy'], immunities: [] },
    Ground: { weaknesses: ['Water', 'Grass', 'Ice'], resistances: ['Poison', 'Rock'], immunities: ['Electric'] },
    Flying: { weaknesses: ['Electric', 'Ice', 'Rock'], resistances: ['Grass', 'Fighting', 'Bug'], immunities: ['Ground'] },
    Psychic: { weaknesses: ['Bug', 'Ghost', 'Dark'], resistances: ['Fighting', 'Psychic'], immunities: [] },
    Bug: { weaknesses: ['Fire', 'Flying', 'Rock'], resistances: ['Grass', 'Fighting', 'Ground'], immunities: [] },
    Rock: { weaknesses: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'], resistances: ['Normal', 'Fire', 'Poison', 'Flying'], immunities: [] },
    Ghost: { weaknesses: ['Ghost', 'Dark'], resistances: ['Poison', 'Bug'], immunities: ['Normal', 'Fighting'] },
    Dragon: { weaknesses: ['Ice', 'Dragon', 'Fairy'], resistances: ['Fire', 'Water', 'Grass', 'Electric'], immunities: [] },
    Dark: { weaknesses: ['Fighting', 'Bug', 'Fairy'], resistances: ['Ghost', 'Dark'], immunities: ['Psychic'] },
    Steel: { weaknesses: ['Fire', 'Fighting', 'Ground'], resistances: ['Normal', 'Grass', 'Ice', 'Flying', 'Psychic', 'Bug', 'Rock', 'Dragon', 'Steel', 'Fairy'], immunities: ['Poison'] },
    Fairy: { weaknesses: ['Poison', 'Steel'], resistances: ['Fighting', 'Bug', 'Dark'], immunities: ['Dragon'] },
};

// --- NEW: Nature Data ---
const NATURES = [
    { name: 'Hardy', increased: null, decreased: null },
    { name: 'Lonely', increased: 'atk', decreased: 'def' },
    { name: 'Brave', increased: 'atk', decreased: 'speed' },
    { name: 'Adamant', increased: 'atk', decreased: 'spatk' },
    { name: 'Naughty', increased: 'atk', decreased: 'spdef' },
    { name: 'Bold', increased: 'def', decreased: 'atk' },
    { name: 'Relaxed', increased: 'def', decreased: 'speed' },
    { name: 'Impish', increased: 'def', decreased: 'spatk' },
    { name: 'Lax', increased: 'def', decreased: 'spdef' },
    { name: 'Timid', increased: 'speed', decreased: 'atk' },
    { name: 'Hasty', increased: 'speed', decreased: 'def' },
    { name: 'Jolly', increased: 'speed', decreased: 'spatk' },
    { name: 'Naive', increased: 'speed', decreased: 'spdef' },
    { name: 'Modest', increased: 'spatk', decreased: 'atk' },
    { name: 'Mild', increased: 'spatk', decreased: 'def' },
    { name: 'Quiet', increased: 'spatk', decreased: 'speed' },
    { name: 'Rash', increased: 'spatk', decreased: 'spdef' },
    { name: 'Calm', increased: 'spdef', decreased: 'atk' },
    { name: 'Gentle', increased: 'spdef', decreased: 'def' },
    { name: 'Sassy', increased: 'spdef', decreased: 'speed' },
    { name: 'Careful', increased: 'spdef', decreased: 'spatk' },
    { name: 'Quirky', increased: null, decreased: null },
    { name: 'Bashful', increased: null, decreased: null },
    { name: 'Serious', increased: null, decreased: null },
    { name: 'Docile', increased: null, decreased: null },
    { name: 'Rash', increased: 'spatk', decreased: 'spdef' }, // Duplicate, remove one if needed
];


const DATA = {
    pokedex: [
        { id: 1, name: 'Sprigatito', types: ['Grass'], evolutions: [{ to: 'Floragato', at: 16 }], genders: ['Male', 'Female'], base: true, locations: ['Starter Pokémon'], baseStats: { hp: 40, atk: 61, def: 54, spatk: 45, spdef: 45, speed: 65 } }, // Added baseStats
        { id: 2, name: 'Floragato', types: ['Grass'], evolutions: [{ to: 'Meowscarada', at: 36 }], genders: ['Male', 'Female'], locations: ['Evolve Sprigatito'], baseStats: { hp: 61, atk: 80, def: 63, spatk: 63, spdef: 63, speed: 83 } }, // Added baseStats
        { id: 3, name: 'Meowscarada', types: ['Grass', 'Dark'], evolutions: [], genders: ['Male', 'Female'], locations: ['Evolve Floragato'], baseStats: { hp: 76, atk: 110, def: 70, spatk: 81, spdef: 70, speed: 123 } }, // Added baseStats
        { id: 4, name: 'Fuecoco', types: ['Fire'], evolutions: [{ to: 'Crocalor', at: 16 }], genders: ['Male', 'Female'], base: true, locations: ['Starter Pokémon'], baseStats: { hp: 67, atk: 45, def: 59, spatk: 63, spdef: 40, speed: 36 } }, // Added baseStats
        { id: 5, name: 'Crocalor', types: ['Fire'], evolutions: [{ to: 'Skeledirge', at: 36 }], genders: ['Male', 'Female'], locations: ['Evolve Fuecoco'], baseStats: { hp: 81, atk: 55, def: 78, spatk: 90, spdef: 58, speed: 49 } }, // Added baseStats
        { id: 6, name: 'Skeledirge', types: ['Fire', 'Ghost'], evolutions: [], genders: ['Male', 'Female'], locations: ['Evolve Crocalor'], baseStats: { hp: 104, atk: 75, def: 100, spatk: 110, spdef: 75, speed: 66 } }, // Added baseStats
        { id: 7, name: 'Quaxly', types: ['Water'], evolutions: [{ to: 'Quaxwell', at: 16 }], genders: ['Male', 'Female'], base: true, locations: ['Starter Pokémon'], baseStats: { hp: 55, atk: 65, def: 45, spatk: 50, spdef: 45, speed: 50 } }, // Added baseStats
        { id: 8, name: 'Quaxwell', types: ['Water'], evolutions: [{ to: 'Quaquaval', at: 36 }], genders: ['Male', 'Female'], locations: ['Evolve Quaxly'], baseStats: { hp: 70, atk: 85, def: 65, spatk: 65, spdef: 60, speed: 85 } }, // Added baseStats
        { id: 9, name: 'Quaquaval', types: ['Water', 'Fighting'], evolutions: [], genders: ['Male', 'Female'], locations: ['Evolve Quaxwell'], baseStats: { hp: 85, atk: 120, def: 80, spatk: 85, spdef: 75, speed: 85 } }, // Added baseStats
        { id: 10, name: 'Lechonk', types: ['Normal'], evolutions: [{ to: 'Oinkologne', at: 18 }], genders: ['Male', 'Female'], base: true, locations: ['South Province (Area One)', 'South Province (Area Two)', 'South Province (Area Three)', 'South Province (Area Four)', 'South Province (Area Five)', 'East Province (Area One)', 'East Province (Area Two)', 'West Province (Area Two)', 'West Province (Area Three)'], baseStats: { hp: 54, atk: 45, def: 40, spatk: 35, spdef: 45, speed: 35 } }, // Added baseStats
        // (This would be filled with all 400 Pokémon)
    ],
    gyms: [
        { name: 'Cortondo Gym', leader: 'Katy', type: 'Bug' }, { name: 'Artazon Gym', leader: 'Brassius', type: 'Grass' },
        { name: 'Levincia Gym', leader: 'Iono', type: 'Electric' }, { name: 'Cascarrafa Gym', leader: 'Kofu', type: 'Water' },
        { name: 'Medali Gym', leader: 'Larry', type: 'Normal' }, { name: 'Montenevera Gym', leader: 'Ryme', type: 'Ghost' },
        { name: 'Alfornada Gym', leader: 'Tulip', type: 'Psychic' }, { name: 'Glaseado Gym', leader: 'Grusha', type: 'Ice' },
    ],
    tms: [
        { id: 1, name: "Take Down" }, { id: 2, name: "Charm" }, { id: 3, name: "Fake Tears" }, { id: 4, name: "Agility" }, { id: 5, name: "Mud-Slap" },
        // (This would be filled with all 171 TMs)
    ],
    items: [
        "Ability Shield", "Adamant Orb", "Aguav Berry", "Air Balloon", "Apicot Berry", "Armorite Ore", "Aspear Berry", "Assault Vest", "Auspicious Armor", "Babiri Berry", "Beast Ball", "Berry Sweet", "Big Root", "Binding Band", "Black Belt", "Black Glasses", "Black Sludge",
        // (This would be a comprehensive item list)
    ],
    moves: [
        { name: "Pound", type: "Normal" }, { name: "Karate Chop", type: "Fighting" }, { name: "Double Slap", type: "Normal" }, { name: "Comet Punch", type: "Normal" }, { name: "Mega Punch", type: "Normal" }, { name: "Pay Day", type: "Normal" }, { name: "Fire Punch", type: "Fire" }, { name: "Ice Punch", type: "Ice" }, { name: "Thunder Punch", type: "Electric" }, { name: "Scratch", type: "Normal" }, { name: "Vise Grip", type: "Normal" }, { name: "Guillotine", type: "Normal" }, { name: "Razor Wind", type: "Normal" }, { name: "Swords Dance", type: "Normal" }, { name: "Cut", type: "Normal" },
        // (This would be a comprehensive move list)
    ],
    sandwiches: [
        { name: "Jambon-Beurre" }, { name: "Classic Bocadillo" }, { name: "Marmalade Sandwich" }, { name: "Tropical Sandwich" }, { name: "Avocado Sandwich" }, { name: "Zesty Sandwich" },
        // (This would be filled with all 151 recipes)
    ]
};

