// --- DATA ---
// Data extracted from your CSV files.
// You can easily add more Pokémon or milestones here.

const DATA = {
    pokedex: [
        { id: 1, name: "Sprigatito" }, { id: 2, name: "Floragato" }, { id: 3, name: "Meowscarada" },
        { id: 4, name: "Fuecoco" }, { id: 5, name: "Crocalor" }, { id: 6, name: "Skeledirge" },
        { id: 7, name: "Quaxly" }, { id: 8, name: "Quaxwell" }, { id: 9, name: "Quaquaval" },
        { id: 10, name: "Lechonk" }, { id: 11, name: "Oinkologne" }, { id: 12, name: "Tarountula" },
        { id: 13, name: "Spidops" }, { id: 14, name: "Nymble" }, { id: 15, name: "Lokix" },
        // This is a small sample. The real tracker would have all 400.
        // To add more, just continue the pattern: { id: 16, name: "Hoppip" },
    ],
    story: [
        { name: "The First Day of School" }, { name: "Victory Road: Cortondo Gym" }, { name: "Path of Legends: Stony Cliff Titan" },
        { name: "Starfall Street: Dark Crew" }, { name: "Victory Road: Artazon Gym" }, { name: "Path of Legends: Open Sky Titan" },
        { name: "Starfall Street: Fire Crew" }, { name: "Victory Road: Levincia Gym" }, { name: "Path of Legends: Lurking Steel Titan" },
        { name: "Starfall Street: Poison Crew" }, { name: "Victory Road: Cascarrafa Gym" }, { name: "Path of Legends: Quaking Earth Titan" },
        { name: "Starfall Street: Fairy Crew" }, { name: "Victory Road: Medali Gym" }, { name: "Path of Legends: False Dragon Titan" },
        { name: "Starfall Street: Fighting Crew" }, { name: "Victory Road: Montenevera Gym" }, { name: "Victory Road: Alfornada Gym" },
        { name: "Victory Road: Glaseado Gym" }, { name: "The Way Home" }, { name: "The Championship" },
    ]
};

const CATEGORIES = [
    { id: 'pokedex', title: 'Paldea Pokédex' },
    { id: 'story', title: 'Story Milestones' }
    // To add a new category, add an entry here and corresponding data in the DATA object above.
];
