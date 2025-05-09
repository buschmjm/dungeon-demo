/**
 * Inventory System - Handles player inventory with weight limits
 * 
 * This module provides functions for managing inventory,
 * including weight tracking, sorting, and organization.
 */

/**
 * Calculate the total weight of items in an inventory
 * @param {Array} items - Array of items with weight property
 * @returns {number} - Total weight
 */
export function calculateTotalWeight(items) {
    if (!items || items.length === 0) {
        return 0;
    }
    
    return items.reduce((total, item) => total + (item.weight || 0), 0);
}

/**
 * Check if adding an item would exceed weight capacity
 * @param {Array} items - Current inventory items
 * @param {Object} newItem - Item to be added
 * @param {number} maxWeight - Maximum weight capacity
 * @returns {boolean} - Whether adding the item would exceed capacity
 */
export function wouldExceedWeightLimit(items, newItem, maxWeight) {
    const currentWeight = calculateTotalWeight(items);
    return currentWeight + (newItem.weight || 0) > maxWeight;
}

/**
 * Sort inventory items by category
 * @param {Array} items - Inventory items to sort
 * @returns {Object} - Items organized by category
 */
export function organizeByCategory(items) {
    if (!items || items.length === 0) {
        return {};
    }
    
    const categories = {
        weapon: [],
        armor: [],
        potion: [],
        treasure: [],
        key: [],
        misc: []
    };
    
    items.forEach(item => {
        const category = categories[item.type] ? item.type : 'misc';
        categories[category].push(item);
    });
    
    return categories;
}

/**
 * Find an item in inventory by name (case insensitive)
 * @param {Array} items - Inventory items to search
 * @param {string} name - Name to search for
 * @returns {Object|null} - Found item or null
 */
export function findItemByName(items, name) {
    if (!items || items.length === 0 || !name) {
        return null;
    }
    
    const searchName = name.toLowerCase();
    
    return items.find(item => 
        item.name.toLowerCase() === searchName ||
        item.name.toLowerCase().includes(searchName)
    ) || null;
}

/**
 * Get a description for an item
 * @param {Object} item - The item object
 * @returns {string} - Item description
 */
export function getItemDescription(item) {
    if (!item) return "Nothing special.";
    
    let description = `${item.name}`;
    
    if (item.weight) {
        description += ` (Weight: ${item.weight})`;
    }
    
    if (item.value) {
        description += ` (Value: ${item.value} gold)`;
    }
    
    if (item.type === 'weapon' && item.damage) {
        description += ` (Damage: ${item.damage})`;
    }
    
    if (item.type === 'armor' && item.protection) {
        description += ` (Protection: ${item.protection})`;
    }
    
    if (item.type === 'potion') {
        const effectDescriptions = {
            heal: "Restores health",
            strength: "Increases strength",
            cure: "Cures poison"
        };
        
        const effectDesc = effectDescriptions[item.effect] || item.effect;
        description += ` (Effect: ${effectDesc})`;
    }
    
    if (item.equipped) {
        description += " [Equipped]";
    }
    
    return description;
}

/**
 * Transfer an item from one inventory to another
 * @param {Array} fromInventory - Source inventory
 * @param {Array} toInventory - Destination inventory
 * @param {string} itemId - ID of the item to transfer
 * @param {number} maxWeight - Weight capacity of destination inventory
 * @returns {Object} - Result of the transfer with success and message
 */
export function transferItem(fromInventory, toInventory, itemId, maxWeight) {
    // Find the item in source inventory
    const itemIndex = fromInventory.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
        return {
            success: false,
            message: "Item not found in source inventory."
        };
    }
    
    const item = fromInventory[itemIndex];
    
    // Check weight limit for destination inventory
    if (wouldExceedWeightLimit(toInventory, item, maxWeight)) {
        return {
            success: false,
            message: "That would exceed your weight limit."
        };
    }
    
    // Transfer the item
    fromInventory.splice(itemIndex, 1);
    toInventory.push(item);
    
    return {
        success: true,
        message: `Transferred ${item.name}.`,
        item
    };
}
