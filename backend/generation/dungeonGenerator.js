/**
 * Dungeon Generator - Procedurally generates dungeon layouts
 * 
 * This module handles the creation of procedurally generated dungeons
 * with connected rooms, corridors, and level layouts.
 */

import { weightedRandom, randomInt, shuffle } from '../systems/utils/weightedRandom.js';

// Room descriptions for different room types
const ROOM_DESCRIPTIONS = {
    entrance: [
        "A torch-lit entrance with ancient stone steps leading down into darkness.",
        "A massive iron door marks the entrance to the dungeon, groaning as it swings open.",
        "A narrow passageway descends steeply into the earth, cool air flowing from below."
    ],
    corridor: [
        "A dimly lit corridor stretches before you, the walls glistening with moisture.",
        "A narrow hallway with cracked stone floor tiles and cobwebs in the corners.",
        "A twisting passage with flickering torches casting dancing shadows on the walls."
    ],
    chamber: [
        "A spacious chamber with high ceilings supported by crumbling stone columns.",
        "A circular room with mysterious symbols etched into the floor.",
        "A damp chamber with water dripping from the ceiling, forming small puddles."
    ],
    treasury: [
        "A small room with ornate chests and display cases, once used to store valuables.",
        "A secure chamber with heavy iron lockboxes built into the walls.",
        "A treasury room with pedestals where valuable artifacts were once displayed."
    ],
    armory: [
        "An old armory with empty weapon racks and broken armor stands.",
        "A room lined with weapon racks and training dummies, long abandoned.",
        "An armory with rusty weapons hanging on the walls and scattered across the floor."
    ],
    library: [
        "A forgotten library with rotting bookshelves and decaying tomes.",
        "A study room with ancient scrolls and manuscripts scattered about.",
        "A chamber with wall-to-wall bookshelves, many books still intact despite the years."
    ],
    ritual: [
        "A disturbing ritual chamber with a large stone altar in the center.",
        "A room with arcane circles carved into the floor, giving off a faint glow.",
        "A dark chamber with strange symbols painted on the walls in what looks like dried blood."
    ],
    prison: [
        "A grim chamber with rusted iron cages and shackles hanging from the walls.",
        "A prison block with small cells lining both sides of a narrow corridor.",
        "A torture chamber with sinister devices and dark stains on the floor."
    ],
    crypt: [
        "A solemn crypt with stone sarcophagi arranged in rows.",
        "A burial chamber with wall niches containing the remains of the deceased.",
        "A mausoleum-like room with elaborate coffins and funerary art."
    ],
    cavern: [
        "A natural cavern with stalactites hanging from the ceiling and stalagmites rising from the floor.",
        "A large cave with a small underground stream flowing through it.",
        "A spacious grotto with glowing fungi providing dim illumination."
    ],
    forge: [
        "An ancient forge with dormant furnaces and anvils covered in dust.",
        "A blacksmith's workshop with hammers, tongs, and other tools still laid out.",
        "A smelting room with large furnaces and molds for casting metal."
    ],
    laboratory: [
        "A wizard's laboratory filled with strange apparatus and dusty alchemical equipment.",
        "An alchemist's workshop with tables covered in vials, tubes, and magical ingredients.",
        "An arcane research room with diagrams etched into the walls and ceiling."
    ]
};

// Object descriptions for the dungeon
const OBJECT_DESCRIPTIONS = {
    furniture: [
        "A wooden table, its surface covered in dust and scratches.",
        "A broken chair lies on its side in the corner.",
        "A bed with rotting sheets and a collapsed frame.",
        "A heavy oak cabinet with most of its doors hanging open."
    ],
    decoration: [
        "Faded tapestries hang on the walls, their designs barely visible.",
        "Iron sconces hold burnt-out torches along the walls.",
        "A cracked mirror reflects a distorted image of the room.",
        "Stone statues of forgotten heroes stand silent guard."
    ],
    container: [
        "A small wooden chest with rusted metal bindings.",
        "A large iron lockbox sits in the corner.",
        "Clay pots of various sizes are arranged along the wall.",
        "A leather satchel has been discarded on the floor."
    ],
    debris: [
        "Broken stones and debris are scattered across the floor.",
        "Pieces of rotted wood and fabric litter the ground.",
        "Fragments of pottery and glass crunch under your feet.",
        "Piles of rubble have fallen from the damaged ceiling."
    ]
};

// Item templates
const ITEM_TEMPLATES = {
    weapon: [
        { name: "Rusty Dagger", damage: "1d4", value: 2, weight: 1 },
        { name: "Short Sword", damage: "1d6", value: 10, weight: 2 },
        { name: "Mace", damage: "1d6", value: 5, weight: 4 },
        { name: "Battleaxe", damage: "1d8", value: 10, weight: 4 }
    ],
    armor: [
        { name: "Leather Armor", protection: 1, value: 10, weight: 10 },
        { name: "Chainmail", protection: 2, value: 75, weight: 20 },
        { name: "Shield", protection: 1, value: 10, weight: 6 }
    ],
    potion: [
        { name: "Health Potion", effect: "heal", power: 20, value: 50, weight: 0.5 },
        { name: "Strength Potion", effect: "strength", power: 5, value: 75, weight: 0.5 },
        { name: "Antidote", effect: "cure", power: 1, value: 25, weight: 0.5 }
    ],
    treasure: [
        { name: "Gold Coins", value: 10, weight: 0.1 },
        { name: "Silver Ring", value: 25, weight: 0.1 },
        { name: "Gemstone", value: 50, weight: 0.1 },
        { name: "Golden Amulet", value: 100, weight: 0.5 }
    ],
    key: [
        { name: "Iron Key", value: 1, weight: 0.1 },
        { name: "Brass Key", value: 1, weight: 0.1 },
        { name: "Silver Key", value: 5, weight: 0.1 }
    ]
};

/**
 * Generate a unique ID for a room
 * @returns {string} - Unique room ID
 */
function generateRoomId() {
    return `room_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Get a random description based on room type
 * @param {string} roomType - Type of room
 * @returns {string} - Room description
 */
function getRandomDescription(roomType) {
    const descriptions = ROOM_DESCRIPTIONS[roomType] || ROOM_DESCRIPTIONS.chamber;
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/**
 * Generate a random object description
 * @returns {string} - Object description
 */
function getRandomObjectDescription() {
    const objectTypes = Object.keys(OBJECT_DESCRIPTIONS);
    const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    const descriptions = OBJECT_DESCRIPTIONS[objectType];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/**
 * Generate random items for a room
 * @param {number} difficulty - Current difficulty level
 * @returns {Array} - Array of items
 */
function generateRoomItems(difficulty) {
    const items = [];
    const itemCount = Math.random() < 0.3 ? randomInt(1, 2) : 0;
    
    for (let i = 0; i < itemCount; i++) {
        // Determine item type based on weighted random
        const itemType = weightedRandom([
            { item: 'weapon', weight: 3 },
            { item: 'armor', weight: 2 },
            { item: 'potion', weight: 4 },
            { item: 'treasure', weight: 5 },
            { item: 'key', weight: difficulty > 2 ? 1 : 0 }
        ]);
        
        // Get a random item template of that type
        const templates = ITEM_TEMPLATES[itemType];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // Create the item
        const item = {
            id: `${itemType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            type: itemType,
            ...template,
            takeable: true
        };
        
        // Add equipment properties if it's a weapon or armor
        if (itemType === 'weapon') {
            item.equipable = true;
            item.slot = 'weapon';
        } else if (itemType === 'armor') {
            item.equipable = true;
            item.slot = 'armor';
        }
        
        items.push(item);
    }
    
    return items;
}

/**
 * Generate a procedural dungeon
 * @param {Object} options - Generation options
 * @returns {Object} - Generated dungeon
 */
export function generateDungeon(options = {}) {
    const {
        depth = 1,
        roomCount = 5 + (depth * 2),
        difficulty = 1
    } = options;
    
    // Define room types with weights (more common to less common)
    const roomTypes = [
        { item: 'chamber', weight: 10 },
        { item: 'corridor', weight: 8 },
        { item: 'cavern', weight: 5 },
        { item: 'crypt', weight: 3 + depth },
        { item: 'treasury', weight: 2 },
        { item: 'armory', weight: 3 },
        { item: 'library', weight: 3 },
        { item: 'prison', weight: 2 + depth },
        { item: 'forge', weight: 2 },
        { item: 'ritual', weight: 1 + depth },
        { item: 'laboratory', weight: 1 + depth }
    ];
    
    // Always start with an entrance
    const rooms = [{
        id: 'entrance',
        name: 'Dungeon Entrance',
        type: 'entrance',
        description: getRandomDescription('entrance'),
        exits: {},
        items: [],
        visited: false
    }];
    
    // Create rooms
    for (let i = 1; i < roomCount; i++) {
        const roomType = weightedRandom(roomTypes);
        const room = {
            id: generateRoomId(),
            name: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)}`,
            type: roomType,
            description: getRandomDescription(roomType),
            detail: getRandomObjectDescription(),
            exits: {},
            items: generateRoomItems(difficulty),
            visited: false
        };
        
        rooms.push(room);
    }
    
    // Connect rooms to form a connected graph
    // First, connect each room to the next to ensure a path through the dungeon
    for (let i = 0; i < rooms.length - 1; i++) {
        const direction = weightedRandom([
            { item: 'north', weight: 1 },
            { item: 'east', weight: 1 },
            { item: 'south', weight: 1 },
            { item: 'west', weight: 1 }
        ]);
        
        const oppositeDirection = {
            north: 'south',
            east: 'west',
            south: 'north',
            west: 'east'
        }[direction];
        
        rooms[i].exits[direction] = rooms[i + 1].id;
        rooms[i + 1].exits[oppositeDirection] = rooms[i].id;
    }
    
    // Add some additional random connections for more complex navigation
    const extraConnections = Math.floor(roomCount / 3);
    for (let i = 0; i < extraConnections; i++) {
        const room1Index = randomInt(0, rooms.length - 1);
        let room2Index;
        
        do {
            room2Index = randomInt(0, rooms.length - 1);
        } while (room1Index === room2Index);
        
        const room1 = rooms[room1Index];
        const room2 = rooms[room2Index];
        
        // Find available directions
        const availableDirections = ['north', 'east', 'south', 'west'].filter(dir => !room1.exits[dir]);
        
        if (availableDirections.length > 0) {
            const direction = availableDirections[randomInt(0, availableDirections.length - 1)];
            const oppositeDirection = {
                north: 'south',
                east: 'west',
                south: 'north',
                west: 'east'
            }[direction];
            
            // Only create the connection if the opposite direction is available in room2
            if (!room2.exits[oppositeDirection]) {
                room1.exits[direction] = room2.id;
                room2.exits[oppositeDirection] = room1.id;
            }
        }
    }
    
    return {
        name: `Level ${depth}`,
        depth,
        difficulty,
        rooms,
        startRoomId: 'entrance'
    };
}
