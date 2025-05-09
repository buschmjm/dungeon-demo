/**
 * Weighted Random Generator - Utility for weighted random selections
 * 
 * This module provides functions for making weighted random selections,
 * which is essential for procedural generation with context-sensitive probabilities.
 */

/**
 * Get a random element from an array
 * @param {Array} array - Array to select from
 * @returns {*} - Random element from the array
 */
export function getRandomElement(array) {
    if (!array || array.length === 0) {
        return null;
    }
    
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Select an item based on weights
 * @param {Array<{item: *, weight: number}>} weightedItems - Array of items with weights
 * @returns {*} - Selected item
 */
export function weightedRandom(weightedItems) {
    if (!weightedItems || weightedItems.length === 0) {
        return null;
    }
    
    // Calculate the total weight
    const totalWeight = weightedItems.reduce((sum, weightedItem) => sum + weightedItem.weight, 0);
    
    // If total weight is 0, return a random item without considering weights
    if (totalWeight === 0) {
        return getRandomElement(weightedItems.map(w => w.item));
    }
    
    // Get a random value between 0 and the total weight
    const randomValue = Math.random() * totalWeight;
    
    // Find the item that corresponds to the random value
    let currentWeight = 0;
    
    for (const weightedItem of weightedItems) {
        currentWeight += weightedItem.weight;
        
        if (randomValue <= currentWeight) {
            return weightedItem.item;
        }
    }
    
    // Fallback (should not reach here if the implementation is correct)
    return weightedItems[weightedItems.length - 1].item;
}

/**
 * Select multiple items based on weights without duplicates
 * @param {Array<{item: *, weight: number}>} weightedItems - Array of items with weights
 * @param {number} count - Number of items to select
 * @returns {Array} - Selected items
 */
export function weightedRandomMultiple(weightedItems, count) {
    if (!weightedItems || weightedItems.length === 0) {
        return [];
    }
    
    // If count is greater than available items, return all items in a random order
    if (count >= weightedItems.length) {
        return shuffle(weightedItems.map(w => w.item));
    }
    
    const result = [];
    const remainingItems = [...weightedItems];
    
    for (let i = 0; i < count; i++) {
        // Select an item
        const selected = weightedRandom(remainingItems);
        result.push(selected);
        
        // Remove the selected item from the remaining items
        const index = remainingItems.findIndex(w => w.item === selected);
        remainingItems.splice(index, 1);
    }
    
    return result;
}

/**
 * Shuffle an array using the Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export function shuffle(array) {
    const result = [...array];
    
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
}

/**
 * Get a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Roll dice in the format "XdY" (X dice with Y sides)
 * @param {string} dice - Dice notation (e.g., "2d6", "1d20")
 * @returns {number} - Sum of dice rolls
 */
export function rollDice(dice) {
    const [count, sides] = dice.toLowerCase().split('d').map(Number);
    
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += randomInt(1, sides);
    }
    
    return total;
}
