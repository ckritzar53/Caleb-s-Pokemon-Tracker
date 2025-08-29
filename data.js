// --- DATA ---
// You can easily add more data to these lists.

const DATA = {
    pokedex: [
        { id: 1, name: "Sprigatito" }, { id: 2, name: "Floragato" }, { id: 3, "name": "Meowscarada" },
        { id: 4, name: "Fuecoco" }, { id: 5, name: "Crocalor" }, { id: 6, "name": "Skeledirge" },
        { id: 7, name: "Quaxly" }, { id: 8, name: "Quaxwell" }, { id: 9, "name": "Quaquaval" },
        { id: 10, name: "Lechonk" }, { id: 11, name: "Oinkologne" }, { id: 12, "name": "Tarountula" },
        // This is a sample. To add all 400, continue the pattern.
    ],
    gyms: [
        { name: "Cortondo Gym", leader: "Katy", type: "Bug", color: "bg-lime-200 text-lime-800" },
        { name: "Artazon Gym", leader: "Brassius", type: "Grass", color: "bg-green-200 text-green-800" },
        { name: "Levincia Gym", leader: "Iono", type: "Electric", color: "bg-yellow-200 text-yellow-800" },
        { name: "Cascarrafa Gym", leader: "Kofu", type: "Water", color: "bg-blue-200 text-blue-800" },
        { name: "Medali Gym", leader: "Larry", type: "Normal", color: "bg-gray-200 text-gray-800" },
        { name: "Montenevera Gym", leader: "Ryme", type: "Ghost", color: "bg-indigo-200 text-indigo-800" },
        { name: "Alfornada Gym", leader: "Tulip", type: "Psychic", color: "bg-pink-200 text-pink-800" },
        { name: "Glaseado Gym", leader: "Grusha", type: "Ice", color: "bg-cyan-200 text-cyan-800" },
    ],
    tms: [
        { id: 1, name: "Take Down" }, { id: 2, name: "Charm" }, { id: 3, name: "Fake Tears" },
        { id: 4, name: "Agility" }, { id: 5, name: "Mud-Slap" }, { id: 6, name: "Scary Face" },
        // Sample list of TMs
    ],
    items: [
        { name: "Ability Shield" }, { name: "Amulet Coin" }, { name: "Auspicious Armor" },
        { name: "Big Root" }, { name: "Black Belt" }, { name: "Black Sludge" },
        // Sample list of items
    ]
};

const CATEGORIES = [
    { id: 'gyms', title: 'Gyms Completed' },
    { id: 'tms', title: 'TMs Collected' },
    { id: 'items', title: 'Items Found' }
];

const POKEDEX_STATUSES = ['seen', 'battled', 'caught'];

