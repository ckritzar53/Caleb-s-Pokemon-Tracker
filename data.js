// --- DATA ---
// You can easily add more data to these lists.

const TYPE_COLORS = {
    Normal: "bg-gray-200 text-gray-800",
    Fire: "bg-orange-200 text-orange-800",
    Water: "bg-blue-200 text-blue-800",
    Grass: "bg-green-200 text-green-800",
    Electric: "bg-yellow-200 text-yellow-800",
    Ice: "bg-cyan-200 text-cyan-800",
    Fighting: "bg-red-200 text-red-800",
    Poison: "bg-purple-200 text-purple-800",
    Ground: "bg-amber-200 text-amber-800",
    Flying: "bg-indigo-200 text-indigo-800",
    Psychic: "bg-pink-200 text-pink-800",
    Bug: "bg-lime-200 text-lime-800",
    Rock: "bg-stone-200 text-stone-800",
    Ghost: "bg-violet-200 text-violet-800",
    Dragon: "bg-teal-200 text-teal-800",
    Dark: "bg-slate-300 text-slate-800",
    Steel: "bg-zinc-300 text-zinc-800",
    Fairy: "bg-fuchsia-200 text-fuchsia-800",
};

const DATA = {
    pokedex: [
        { id: 1, name: "Sprigatito", types: ["Grass"] }, 
        { id: 2, name: "Floragato", types: ["Grass"] }, 
        { id: 3, name: "Meowscarada", types: ["Grass", "Dark"] },
        { id: 4, name: "Fuecoco", types: ["Fire"] }, 
        { id: 5, name: "Crocalor", types: ["Fire"] }, 
        { id: 6, name: "Skeledirge", types: ["Fire", "Ghost"] },
        { id: 7, name: "Quaxly", types: ["Water"] }, 
        { id: 8, name: "Quaxwell", types: ["Water"] }, 
        { id: 9, name: "Quaquaval", types: ["Water", "Fighting"] },
        { id: 10, name: "Lechonk", types: ["Normal"] }, 
        { id: 11, name: "Oinkologne", types: ["Normal"] }, 
        { id: 12, name: "Tarountula", types: ["Bug"] },
        // Sample list. To add more, continue the pattern with a `types` array.
    ],
    gyms: [
        { name: "Cortondo Gym", leader: "Katy", type: "Bug" },
        { name: "Artazon Gym", leader: "Brassius", type: "Grass" },
        { name: "Levincia Gym", leader: "Iono", type: "Electric" },
        { name: "Cascarrafa Gym", leader: "Kofu", type: "Water" },
        { name: "Medali Gym", leader: "Larry", type: "Normal" },
        { name: "Montenevera Gym", leader: "Ryme", type: "Ghost" },
        { name: "Alfornada Gym", leader: "Tulip", type: "Psychic" },
        { name: "Glaseado Gym", leader: "Grusha", type: "Ice" },
    ],
    tms: [
        { id: 1, name: "Take Down" }, { id: 2, name: "Charm" }, { id: 3, name: "Fake Tears" },
        { id: 4, name: "Agility" }, { id: 5, name: "Mud-Slap" }, { id: 6, name: "Scary Face" },
    ],
    items: [
        { name: "Ability Shield" }, { name: "Amulet Coin" }, { name: "Auspicious Armor" },
        { name: "Big Root" }, { name: "Black Belt" }, { name: "Black Sludge" },
    ]
};

const CATEGORIES = [
    { id: 'gyms', title: 'Gyms Completed' },
    { id: 'tms', title: 'TMs Collected' },
    { id: 'items', title: 'Items Found' }
];

const POKEDEX_STATUSES = ['seen', 'battled', 'caught'];

