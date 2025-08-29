const TYPE_COLORS = {
    Normal: "bg-gray-400 text-gray-900", Fire: "bg-orange-500 text-white", Water: "bg-blue-500 text-white",
    Grass: "bg-green-500 text-white", Electric: "bg-yellow-400 text-gray-900", Ice: "bg-cyan-300 text-gray-900",
    Fighting: "bg-red-600 text-white", Poison: "bg-purple-500 text-white", Ground: "bg-amber-600 text-white",
    Flying: "bg-indigo-400 text-white", Psychic: "bg-pink-500 text-white", Bug: "bg-lime-500 text-white",
    Rock: "bg-stone-500 text-white", Ghost: "bg-violet-600 text-white", Dragon: "bg-teal-500 text-white",
    Dark: "bg-slate-600 text-white", Steel: "bg-zinc-400 text-gray-900", Fairy: "bg-fuchsia-400 text-white",
};

const DATA = {
    pokedex: [
        { id: 1, name: "Sprigatito", types: ["Grass"], base: true, evolutions: [{ to: "Floragato", at: 16 }], genders: ["Male", "Female"] }, 
        { id: 2, name: "Floragato", types: ["Grass"], evolutions: [{ to: "Meowscarada", at: 36 }], genders: ["Male", "Female"] }, 
        { id: 3, name: "Meowscarada", types: ["Grass", "Dark"], evolutions: [], genders: ["Male", "Female"] },
        { id: 4, name: "Fuecoco", types: ["Fire"], base: true, evolutions: [{ to: "Crocalor", at: 16 }], genders: ["Male", "Female"] }, 
        { id: 5, name: "Crocalor", types: ["Fire"], evolutions: [{ to: "Skeledirge", at: 36 }], genders: ["Male", "Female"] }, 
        { id: 6, name: "Skeledirge", types: ["Fire", "Ghost"], evolutions: [], genders: ["Male", "Female"] },
        { id: 7, name: "Quaxly", types: ["Water"], base: true, evolutions: [{ to: "Quaxwell", at: 16 }], genders: ["Male", "Female"] }, 
        { id: 8, name: "Quaxwell", types: ["Water"], evolutions: [{ to: "Quaquaval", at: 36 }], genders: ["Male", "Female"] }, 
        { id: 9, name: "Quaquaval", types: ["Water", "Fighting"], evolutions: [], genders: ["Male", "Female"] },
        { id: 10, name: "Lechonk", types: ["Normal"], base: true, evolutions: [{ to: "Oinkologne", at: 18 }], genders: ["Male", "Female"] }, 
        { id: 11, name: "Oinkologne", types: ["Normal"], evolutions: [], genders: ["Male", "Female"] }, 
        { id: 12, name: "Tarountula", types: ["Bug"], base: true, evolutions: [{ to: "Spidops", at: 15 }], genders: ["Male", "Female"] },
        { id: 13, name: "Spidops", types: ["Bug"], evolutions: [], genders: ["Male", "Female"] },
    ],
    gyms: [
        { name: "Cortondo Gym", leader: "Katy", type: "Bug" }, { name: "Artazon Gym", leader: "Brassius", type: "Grass" },
        { name: "Levincia Gym", leader: "Iono", type: "Electric" }, { name: "Cascarrafa Gym", leader: "Kofu", type: "Water" },
        { name: "Medali Gym", leader: "Larry", type: "Normal" }, { name: "Montenevera Gym", leader: "Ryme", type: "Ghost" },
        { name: "Alfornada Gym", leader: "Tulip", type: "Psychic" }, { name: "Glaseado Gym", leader: "Grusha", type: "Ice" },
    ],
    tms: [ { id: 1, name: "Take Down" }, { id: 2, name: "Charm" }, { id: 3, name: "Fake Tears" }, { id: 4, name: "Agility" }, { id: 5, name: "Mud-Slap" }],
    items: [
        "Ability Shield", "Amulet Coin", "Auspicious Armor", "Big Root", "Black Belt", "Black Sludge", "Choice Band", 
        "Choice Scarf", "Choice Specs", "Eviolite", "Expert Belt", "Focus Sash", "Leftovers", "Life Orb", "Rocky Helmet", "Scope Lens"
    ],
    moves: [
        { name: "Tackle", type: "Normal" }, { name: "Growl", type: "Normal" }, { name: "Scratch", type: "Normal" },
        { name: "Ember", type: "Fire" }, { name: "Water Gun", type: "Water" }, { name: "Vine Whip", type: "Grass" },
        { name: "Thunder Shock", type: "Electric" }, { name: "Quick Attack", type: "Normal" }, { name: "Hyper Beam", type: "Normal" },
        { name: "Solar Beam", type: "Grass" }, { name: "Flamethrower", type: "Fire" }, { name: "Hydro Pump", type: "Water" },
        { name: "Thunderbolt", type: "Electric" }, { name: "Ice Beam", type: "Ice" }, { name: "Psychic", type: "Psychic" },
        { name: "Shadow Ball", type: "Ghost" }, { name: "Earthquake", type: "Ground" }, { name: "Rock Slide", type: "Rock" },
        { name: "Dragon Claw", type: "Dragon" }, { name: "Swords Dance", type: "Normal" }
    ]
};

const CATEGORIES = [
    { id: 'gyms', title: 'Gyms Completed' }, { id: 'tms', title: 'TMs Collected' }, { id: 'items', title: 'Items Found' }
];
const POKEDEX_STATUSES = ['seen', 'battled', 'caught'];

