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
        { name: "Cortondo Gym", leader: "Katy", type: "Bug", typeColor: "bg-lime-500" },
        { name: "Artazon Gym", leader: "Brassius", type: "Grass", typeColor: "bg-green-500" },
        { name: "Levincia Gym", leader: "Iono", type: "Electric", typeColor: "bg-yellow-400" },
        { name: "Cascarrafa Gym", leader: "Kofu", type: "Water", typeColor: "bg-blue-500" },
        { name: "Medali Gym", leader: "Larry", type: "Normal", typeColor: "bg-gray-400" },
        { name: "Montenevera Gym", leader: "Ryme", type: "Ghost", typeColor: "bg-indigo-400" },
        { name: "Alfornada Gym", leader: "Tulip", type: "Psychic", typeColor: "bg-pink-500" },
        { name: "Glaseado Gym", leader: "Grusha", type: "Ice", typeColor: "bg-cyan-300" },
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

