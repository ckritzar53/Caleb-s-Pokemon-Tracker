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

const DATA = {
    pokedex: [
        // This is a small sample. In a real app, all 400 Pokémon would be here.
        { id: 1, name: 'Sprigatito', types: ['Grass'], evolutions: [{ to: 'Floragato', at: 16 }], genders: ['Male', 'Female'], base: true, locations: ['Starter Pokémon'] },
        { id: 2, name: 'Floragato', types: ['Grass'], evolutions: [{ to: 'Meowscarada', at: 36 }], genders: ['Male', 'Female'], locations: ['Evolve Sprigatito'] },
        { id: 3, name: 'Meowscarada', types: ['Grass', 'Dark'], evolutions: [], genders: ['Male', 'Female'], locations: ['Evolve Floragato'] },
        { id: 4, name: 'Fuecoco', types: ['Fire'], evolutions: [{ to: 'Crocalor', at: 16 }], genders: ['Male', 'Female'], base: true, locations: ['Starter Pokémon'] },
        { id: 5, name: 'Crocalor', types: ['Fire'], evolutions: [{ to: 'Skeledirge', at: 36 }], genders: ['Male', 'Female'], locations: ['Evolve Fuecoco'] },
        { id: 6, name: 'Skeledirge', types: ['Fire', 'Ghost'], evolutions: [], genders: ['Male', 'Female'], locations: ['Evolve Crocalor'] },
        { id: 7, name: 'Quaxly', types: ['Water'], evolutions: [{ to: 'Quaxwell', at: 16 }], genders: ['Male', 'Female'], base: true, locations: ['Starter Pokémon'] },
        { id: 8, name: 'Quaxwell', types: ['Water'], evolutions: [{ to: 'Quaquaval', at: 36 }], genders: ['Male', 'Female'], locations: ['Evolve Quaxly'] },
        { id: 9, name: 'Quaquaval', types: ['Water', 'Fighting'], evolutions: [], genders: ['Male', 'Female'], locations: ['Evolve Quaxwell'] },
        { id: 10, name: 'Lechonk', types: ['Normal'], evolutions: [{ to: 'Oinkologne', at: 18 }], genders: ['Male', 'Female'], base: true, locations: ['South Province (Area One, Two, Three, Four, Five)', 'East Province (Area One, Two)', 'West Province (Area Two, Three)'] },
        // ... ALL 400 POKEMON WOULD GO HERE
    ],
    gyms: [
        { name: 'Cortondo Gym', leader: 'Katy', type: 'Bug' },
        { name: 'Artazon Gym', leader: 'Brassius', type: 'Grass' },
        { name: 'Levincia Gym', leader: 'Iono', type: 'Electric' },
        { name: 'Cascarrafa Gym', leader: 'Kofu', type: 'Water' },
        { name: 'Medali Gym', leader: 'Larry', type: 'Normal' },
        { name: 'Montenevera Gym', leader: 'Ryme', type: 'Ghost' },
        { name: 'Alfornada Gym', leader: 'Tulip', type: 'Psychic' },
        { name: 'Glaseado Gym', leader: 'Grusha', type: 'Ice' },
    ],
    tms: [
        { id: 1, name: "Take Down" }, { id: 2, name: "Charm" }, { id: 3, name: "Fake Tears" },
        // ... ALL 171 TMS WOULD GO HERE
    ],
    items: [
        "Ability Shield", "Adamant Orb", "Aguav Berry", "Air Balloon",
        // ... ALL RELEVANT ITEMS
    ],
    moves: [
        { name: "Pound", type: "Normal" }, { name: "Karate Chop", type: "Fighting" }, { name: "Double Slap", type: "Normal" },
        { name: "Tackle", type: "Normal" }, { name: "Scratch", type: "Normal" }, { name: "Ember", type: "Fire" },
        { name: "Water Gun", type: "Water" }, { name: "Vine Whip", type: "Grass" }, { name: "Thunder Shock", type: "Electric" },
        // ... A COMPREHENSIVE LIST OF MOVES
    ],
    sandwiches: [
        { name: "Jambon-Beurre" }, { name: "Classic Bocadillo" }, { name: "Marmalade Sandwich" },
        // ... ALL 151 SANDWICH RECIPES
    ]
};

