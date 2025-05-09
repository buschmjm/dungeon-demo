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
    // This would import/call your game initialization logic from game.js
    // For now, return a minimal response structure
    return {
        success: true,
        messages: [
            "Welcome to the Dungeon Demo!",
            "Type commands to interact with the game.",
            "Try typing 'help' for a list of commands."
        ],
        gameState: {} // Will be populated by your game logic
    };
}

/**
 * Process a player command
 * @param {string} command - The command entered by the player
 * @param {Object} gameState - The current game state
 * @returns {Object} - Updated game state and response messages
 */
export function processCommand(command, gameState) {
    // This would import/call your command processing logic from game.js
    // For now, return a minimal response structure
    return {
        success: true,
        messages: [`Echo: ${command}`], // Placeholder response
        gameState: gameState // Return unmodified state for now
    };
}
