const TYPE_COLORS = {
    Normal: "bg-gray-200 text-gray-800", Fire: "bg-orange-200 text-orange-800", Water: "bg-blue-200 text-blue-800",
    Grass: "bg-green-200 text-green-800", Electric: "bg-yellow-200 text-yellow-800", Ice: "bg-cyan-200 text-cyan-800",
    Fighting: "bg-red-200 text-red-800", Poison: "bg-purple-200 text-purple-800", Ground: "bg-amber-200 text-amber-800",
    Flying: "bg-indigo-200 text-indigo-800", Psychic: "bg-pink-200 text-pink-800", Bug: "bg-lime-200 text-lime-800",
    Rock: "bg-stone-200 text-stone-800", Ghost: "bg-violet-200 text-violet-800", Dragon: "bg-teal-200 text-teal-800",
    Dark: "bg-slate-300 text-slate-800", Steel: "bg-zinc-300 text-zinc-800", Fairy: "bg-fuchsia-200 text-fuchsia-800",
};

const DATA = {
    pokedex: [
        // Each Pokémon now has an evolution chain property.
        // `base: true` marks the first in a line for the smart box filter.
        { id: 1, name: "Sprigatito", types: ["Grass"], base: true, evolutions: [{ to: "Floragato", at: 16 }] }, 
        { id: 2, name: "Floragato", types: ["Grass"], evolutions: [{ to: "Meowscarada", at: 36 }] }, 
        { id: 3, name: "Meowscarada", types: ["Grass", "Dark"], evolutions: [] },
        { id: 4, name: "Fuecoco", types: ["Fire"], base: true, evolutions: [{ to: "Crocalor", at: 16 }] }, 
        { id: 5, name: "Crocalor", types: ["Fire"], evolutions: [{ to: "Skeledirge", at: 36 }] }, 
        { id: 6, name: "Skeledirge", types: ["Fire", "Ghost"], evolutions: [] },
        { id: 7, name: "Quaxly", types: ["Water"], base: true, evolutions: [{ to: "Quaxwell", at: 16 }] }, 
        { id: 8, name: "Quaxwell", types: ["Water"], evolutions: [{ to: "Quaquaval", at: 36 }] }, 
        { id: 9, name: "Quaquaval", types: ["Water", "Fighting"], evolutions: [] },
        { id: 10, name: "Lechonk", types: ["Normal"], base: true, evolutions: [{ to: "Oinkologne", at: 18 }] }, 
        { id: 11, name: "Oinkologne", types: ["Normal"], evolutions: [] }, 
        { id: 12, name: "Tarountula", types: ["Bug"], base: true, evolutions: [{ to: "Spidops", at: 15 }] },
        { id: 13, name: "Spidops", types: ["Bug"], evolutions: [] },
    ],
    gyms: [
        { name: "Cortondo Gym", leader: "Katy", type: "Bug" }, { name: "Artazon Gym", leader: "Brassius", type: "Grass" },
        { name: "Levincia Gym", leader: "Iono", type: "Electric" }, { name: "Cascarrafa Gym", leader: "Kofu", type: "Water" },
        { name: "Medali Gym", leader: "Larry", type: "Normal" }, { name: "Montenevera Gym", leader: "Ryme", type: "Ghost" },
        { name: "Alfornada Gym", leader: "Tulip", type: "Psychic" }, { name: "Glaseado Gym", leader: "Grusha", type: "Ice" },
    ],
    tms: [ { id: 1, name: "Take Down" }, { id: 2, name: "Charm" }, { id: 3, name: "Fake Tears" } ],
    items: [ // Expanded for held items
        "Ability Shield", "Amulet Coin", "Auspicious Armor", "Big Root", "Black Belt", "Black Sludge",
        "Black Glasses", "Bright Powder", "Charcoal", "Choice Band", "Choice Scarf", "Choice Specs",
        "Covert Cloak", "Eviolite", "Expert Belt", "Focus Sash", "King's Rock", "Leftovers", "Life Orb",
        "Light Clay", "Magnet", "Mental Herb", "Metal Coat", "Metronome", "Miracle Seed", "Mystic Water",
        "Never-Melt Ice", "Power Herb", "Quick Claw", "Rocky Helmet", "Scope Lens", "Sharp Beak",
        "Shell Bell", "Silk Scarf", "Silver Powder", "Soft Sand", "Spell Tag", "Twisted Spoon", "White Herb"
    ],
    moves: [ // Sample move list for dropdowns
        "Tackle", "Growl", "Scratch", "Ember", "Water Gun", "Vine Whip", "Thunder Shock", "Quick Attack",
        "Hyper Beam", "Solar Beam", "Flamethrower", "Hydro Pump", "Thunderbolt", "Ice Beam", "Psychic",
        "Shadow Ball", "Earthquake", "Rock Slide", "Dragon Claw", "Swords Dance", "Calm Mind", "Protect"
    ]
};

const CATEGORIES = [
    { id: 'gyms', title: 'Gyms Completed' }, { id: 'tms', title: 'TMs Collected' }, { id: 'items', title: 'Items Found' }
];
const POKEDEX_STATUSES = ['seen', 'battled', 'caught'];

