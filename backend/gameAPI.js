/**
 * Game API - Interface between frontend and backend
 * 
 * This file handles the communication between the frontend and backend.
 * It provides two main functions:
 * 1. initializeGame() - Sets up the initial game state
 * 2. processCommand() - Processes user commands and returns results
 */

/**
 * Initialize a new game
 * @returns {Object} - Initial game state and welcome messages
 */
export function initializeGame() {
    // Create initial game state - customize this based on your game needs
    const initialGameState = {
        player: {
            name: "Adventurer",
            health: 100,
            maxHealth: 100,
            level: 1,
            // Add other player properties as needed
        },
        // Add other game state properties as needed
    };

    return {
        success: true,
        messages: [
            "Welcome to the Dungeon Demo!",
            "Type commands to interact with the game.",
            "Try typing 'help' for a list of commands."
        ],
        gameState: {            player: {
                name: "Adventurer",
                health: 100,
                maxHealth: 100,
                level: 1,
                // Add other player properties as needed
            },
            // Add other game state properties as needed
        }
    };
}

/**
 * Process a player command
 * @param {string} command - The command entered by the player
 * @param {Object} gameState - The current game state
 * @returns {Object} - Updated game state and response messages
 */
export function processCommand(command, gameState) {
    // Parse the command (simplified example)
    const cmd = command.toLowerCase().trim();
    
    // Create a new copy of the game state to avoid modifying the original
    const newGameState = JSON.parse(JSON.stringify(gameState));
    
    // Example command processing - replace with your own game logic
    let messages = [];
    
    if (cmd === 'help') {
        messages = [
            "Available commands:",
            "- help: Show this help message",
            // Add more commands as you implement them
        ];
    } else if (cmd.startsWith('echo ')) {
        // Simple echo command for testing
        const message = command.substring(5);
        messages = [`Echo: ${message}`];
    } else {
        // Default response
        messages = [`Command not recognized: '${command}'. Type 'help' for available commands.`];
    }
    
    return {
        success: true,
        messages: messages,
        gameState: newGameState
    };
}

/**
 * Process the 'help' command
 * @param {string} args - Command arguments
 * @returns {Array<string>} - Help messages
 */
function processHelpCommand(args) {
    // General help menu
    if (!args) {
        return [
            "Available commands:",
            "- look [object] - Examine your surroundings or a specific object",
            "- go <direction> - Move in a direction (north, south, east, west)",
            "- take <item> - Pick up an item",
            "- drop <item> - Drop an item from your inventory",
            "- inventory (or inv, i) - Check what you're carrying",
            "- stats - Show your character stats",
            "- equip <item> - Equip a weapon or armor",
            "- use <item> - Use an item from your inventory",
            "- help [command] - Show this help menu or help for a specific command"
        ];
    }
    
    // Specific command help
    const specificCommand = args.toLowerCase();
    
    switch (specificCommand) {
        case 'look':
            return [
                "LOOK command:",
                "- look - Examine your current surroundings",
                "- look <object> - Examine a specific object or item",
                "- look <direction> - Look in a specific direction"
            ];
            
        case 'go':
            return [
                "GO command:",
                "- go <direction> - Move in a direction (north, south, east, west)",
                "Example: 'go north'"
            ];
            
        case 'take':
            return [
                "TAKE command:",
                "- take <item> - Pick up an item from your surroundings",
                "Example: 'take sword'"
            ];
            
        case 'drop':
            return [
                "DROP command:",
                "- drop <item> - Drop an item from your inventory",
                "Example: 'drop potion'"
            ];
            
        case 'inventory':
        case 'inv':
        case 'i':
            return [
                "INVENTORY command:",
                "- inventory - List all items you're carrying",
                "You can also use 'inv' or 'i' as shortcuts"
            ];
            
        case 'stats':
            return [
                "STATS command:",
                "- stats - Show your character's statistics and attributes"
            ];
            
        case 'equip':
            return [
                "EQUIP command:",
                "- equip <item> - Equip a weapon or armor from your inventory",
                "Example: 'equip sword'"
            ];
            
        case 'use':
            return [
                "USE command:",
                "- use <item> - Use a consumable item from your inventory",
                "Example: 'use health potion'"
            ];
            
        default:
            return [`No help available for '${specificCommand}'. Type 'help' for all commands.`];
    }
}

/**
 * Process the 'look' command
 * @param {string} args - Command arguments
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Look messages
 */
function processLookCommand(args, gameState) {
    const currentLocation = gameState.currentLocation;
    
    // Look at current location
    if (!args) {
        const messages = [
            currentLocation.name,
            currentLocation.description
        ];
        
        // Add the detail if it exists
        if (currentLocation.detail) {
            messages.push(currentLocation.detail);
        }
        
        // List exits
        const exits = Object.keys(currentLocation.exits || {});
        if (exits.length > 0) {
            messages.push(`Exits: ${exits.join(', ')}`);
        } else {
            messages.push("There are no obvious exits.");
        }
        
        // List items
        if (currentLocation.items && currentLocation.items.length > 0) {
            const itemNames = currentLocation.items.map(item => item.name).join(', ');
            messages.push(`You see: ${itemNames}`);
        }
        
        return messages;
    }
    
    // Look at a specific direction
    const directions = ['north', 'east', 'south', 'west'];
    if (directions.includes(args)) {
        if (currentLocation.exits && currentLocation.exits[args]) {
            return [`You see a path leading ${args}.`];
        } else {
            return [`There is no path leading ${args}.`];
        }
    }
    
    // Look at a specific item in the room
    if (currentLocation.items) {
        const item = currentLocation.items.find(
            i => i.name.toLowerCase() === args.toLowerCase() ||
                 i.name.toLowerCase().includes(args.toLowerCase())
        );
        
        if (item) {
            return [
                item.name,
                item.description || "Nothing special about it.",
                `It weighs ${item.weight} units.`
            ];
        }
    }
    
    // Look at an item in inventory
    const inventoryItem = gameState.player.inventory.find(
        i => i.name.toLowerCase() === args.toLowerCase() ||
             i.name.toLowerCase().includes(args.toLowerCase())
    );
    
    if (inventoryItem) {
        return [
            inventoryItem.name,
            inventoryItem.description || "Nothing special about it.",
            `It weighs ${inventoryItem.weight} units.`
        ];
    }
    
    return [`You don't see any '${args}' here.`];
}

/**
 * Process the 'go' command
 * @param {string} args - Command arguments (direction)
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Movement messages
 */
function processGoCommand(args, gameState) {
    if (!args) {
        return ["Go where? Specify a direction (north, south, east, west)."];
    }
    
    const direction = args.toLowerCase();
    const currentLocation = gameState.currentLocation;
    
    // Check if the direction is valid
    if (!currentLocation.exits || !currentLocation.exits[direction]) {
        return [`You can't go ${direction} from here.`];
    }
    
    // Get the ID of the destination room
    const destinationId = currentLocation.exits[direction];
    
    // Find the destination room in the dungeon
    const destination = gameState.dungeon.rooms.find(room => room.id === destinationId);
    
    if (!destination) {
        return [`Error: Could not find room with ID ${destinationId}.`];
    }
    
    // Update the current location
    gameState.currentLocation = destination;
    
    // Mark the room as visited
    destination.visited = true;
    
    return [
        `You go ${direction}.`,
        destination.name,
        destination.description
    ];
}

/**
 * Process the 'take' command
 * @param {string} args - Command arguments (item name)
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Take messages
 */
function processTakeCommand(args, gameState) {
    if (!args) {
        return ["Take what?"];
    }
    
    const currentLocation = gameState.currentLocation;
    
    // Check if there are items in the room
    if (!currentLocation.items || currentLocation.items.length === 0) {
        return ["There's nothing here to take."];
    }
    
    // Find the item in the room
    const itemIndex = currentLocation.items.findIndex(
        item => item.name.toLowerCase() === args.toLowerCase() ||
                item.name.toLowerCase().includes(args.toLowerCase())
    );
    
    if (itemIndex === -1) {
        return [`You don't see any '${args}' here.`];
    }
    
    const item = currentLocation.items[itemIndex];
    
    // Check if the item can be taken
    if (!item.takeable) {
        return [`You cannot take the ${item.name}.`];
    }
    
    // Check if taking this item would exceed the player's weight limit
    if (gameState.player.currentWeight + item.weight > gameState.player.maxCarryWeight) {
        return [`The ${item.name} is too heavy to carry with your current load.`];
    }
    
    // Add the item to player inventory
    gameState.player.inventory.push(item);
    gameState.player.currentWeight += item.weight;
    
    // Remove the item from the room
    currentLocation.items.splice(itemIndex, 1);
    
    return [`You take the ${item.name}.`];
}

/**
 * Process the 'drop' command
 * @param {string} args - Command arguments (item name)
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Drop messages
 */
function processDropCommand(args, gameState) {
    if (!args) {
        return ["Drop what?"];
    }
    
    // Check if player has any items
    if (!gameState.player.inventory || gameState.player.inventory.length === 0) {
        return ["You aren't carrying anything."];
    }
    
    // Find the item in inventory
    const itemIndex = gameState.player.inventory.findIndex(
        item => item.name.toLowerCase() === args.toLowerCase() ||
                item.name.toLowerCase().includes(args.toLowerCase())
    );
    
    if (itemIndex === -1) {
        return [`You don't have any '${args}'.`];
    }
    
    const item = gameState.player.inventory[itemIndex];
    
    // Check if the item is equipped
    if (item.equipped) {
        return [`You need to unequip the ${item.name} first.`];
    }
    
    // Remove from inventory
    gameState.player.inventory.splice(itemIndex, 1);
    gameState.player.currentWeight -= item.weight;
    
    // Add to current location
    if (!gameState.currentLocation.items) {
        gameState.currentLocation.items = [];
    }
    
    gameState.currentLocation.items.push(item);
    
    return [`You drop the ${item.name}.`];
}

/**
 * Process the 'inventory' command
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Inventory messages
 */
function processInventoryCommand(gameState) {
    const inventory = gameState.player.inventory;
    
    if (!inventory || inventory.length === 0) {
        return ["Your inventory is empty."];
    }
    
    const messages = ["You are carrying:"];
    
    inventory.forEach(item => {
        const equippedText = item.equipped ? " (equipped)" : "";
        messages.push(`- ${item.name}${equippedText} (${item.weight} weight)`);
    });
    
    messages.push(`Total weight: ${gameState.player.currentWeight}/${gameState.player.maxCarryWeight}`);
    
    return messages;
}

/**
 * Process the 'stats' command
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Stats messages
 */
function processStatsCommand(gameState) {
    const player = gameState.player;
    
    return [
        `Name: ${player.name}`,
        `Level: ${player.level}`,
        `Experience: ${player.experience}/${player.experienceToNextLevel}`,
        `Health: ${player.health}/${player.maxHealth}`,
        "",
        "Stats:",
        `Strength: ${player.stats.strength}`,
        `Dexterity: ${player.stats.dexterity}`,
        `Intelligence: ${player.stats.intelligence}`,
        `Constitution: ${player.stats.constitution}`,
        "",
        "Skills:",
        `Combat: ${player.skills.combat}`,
        `Magic: ${player.skills.magic}`,
        `Stealth: ${player.skills.stealth}`,
        `Perception: ${player.skills.perception}`
    ];
}

/**
 * Process the 'equip' command
 * @param {string} args - Command arguments (item name)
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Equip messages
 */
function processEquipCommand(args, gameState) {
    if (!args) {
        return ["Equip what?"];
    }
    
    // Check if player has any items
    if (!gameState.player.inventory || gameState.player.inventory.length === 0) {
        return ["You have nothing to equip."];
    }
    
    // Find the item in inventory
    const item = gameState.player.inventory.find(
        item => item.name.toLowerCase() === args.toLowerCase() ||
                item.name.toLowerCase().includes(args.toLowerCase())
    );
    
    if (!item) {
        return [`You don't have any '${args}'.`];
    }
    
    // Check if the item can be equipped
    if (!item.equipable) {
        return [`You cannot equip the ${item.name}.`];
    }
    
    // If the item is already equipped
    if (item.equipped) {
        return [`You already have the ${item.name} equipped.`];
    }
    
    // Unequip any existing item in the same slot
    const existingEquipped = gameState.player.inventory.find(
        i => i.equipped && i.slot === item.slot
    );
    
    if (existingEquipped) {
        existingEquipped.equipped = false;
    }
    
    // Equip the new item
    item.equipped = true;
    
    return [`You equip the ${item.name}.`];
}

/**
 * Process the 'use' command
 * @param {string} args - Command arguments (item name)
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Use messages
 */
function processUseCommand(args, gameState) {
    if (!args) {
        return ["Use what?"];
    }
    
    // Check if player has any items
    if (!gameState.player.inventory || gameState.player.inventory.length === 0) {
        return ["You have nothing to use."];
    }
    
    // Find the item in inventory
    const itemIndex = gameState.player.inventory.findIndex(
        item => item.name.toLowerCase() === args.toLowerCase() ||
                item.name.toLowerCase().includes(args.toLowerCase())
    );
    
    if (itemIndex === -1) {
        return [`You don't have any '${args}'.`];
    }
    
    const item = gameState.player.inventory[itemIndex];
    
    // Handle different item types
    if (item.type === 'potion') {
        return usePotion(item, itemIndex, gameState);
    } else if (item.type === 'key') {
        return useKey(item, gameState);
    } else {
        return [`You can't figure out how to use the ${item.name}.`];
    }
}

/**
 * Use a potion item
 * @param {Object} potion - The potion item
 * @param {number} index - Index in inventory
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Result messages
 */
function usePotion(potion, index, gameState) {
    const messages = [`You use the ${potion.name}.`];
    
    // Handle different potion effects
    switch (potion.effect) {
        case 'heal':
            const oldHealth = gameState.player.health;
            gameState.player.health = Math.min(
                gameState.player.health + potion.power,
                gameState.player.maxHealth
            );
            const healed = gameState.player.health - oldHealth;
            messages.push(`You feel refreshed and recover ${healed} health.`);
            break;
            
        case 'strength':
            gameState.player.stats.strength += potion.power;
            messages.push(`You feel stronger! Your strength increases by ${potion.power}.`);
            break;
            
        case 'cure':
            messages.push("You feel purified. Any poison has been neutralized.");
            break;
            
        default:
            messages.push(`The potion has an unknown effect.`);
    }
    
    // Remove the potion from inventory
    gameState.player.inventory.splice(index, 1);
    gameState.player.currentWeight -= potion.weight;
    
    return messages;
}

/**
 * Use a key item
 * @param {Object} key - The key item
 * @param {Object} gameState - Current game state
 * @returns {Array<string>} - Result messages
 */
function useKey(key, gameState) {
    // In a more complex implementation, this would check for locked doors, etc.
    return [`You try to use the ${key.name}, but there's nothing to unlock here.`];
}

// No need for other functions since all game logic will be implemented
// directly by the user

// To implement this game, add your game logic to this file or import from other files
// The game will follow the following pattern:
// 1. User enters a command in the frontend
// 2. Command is sent to processCommand() function
// 3. Game logic processes the command and returns results
// 4. Frontend displays the results to the user
