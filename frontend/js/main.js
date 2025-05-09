/**
 * Main frontend script for the procedural dungeon game
 */

// Import frontend components
import { TerminalUI } from './terminalUI.js';
import { GameClient } from './gameClient.js';

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the terminal UI
    const terminal = new TerminalUI({
        outputElement: document.getElementById('game-output'),
        inputElement: document.getElementById('command-input'),
        formElement: document.getElementById('command-form'),
        statsElement: {
            name: document.getElementById('stat-name'),
            health: document.getElementById('stat-health'),
            level: document.getElementById('stat-level'),
            xp: document.getElementById('stat-xp'),
            weight: document.getElementById('stat-weight')
        },
        inventoryElement: document.getElementById('inventory-list')
    });
    
    // Initialize the game client that communicates with the backend API
    const gameClient = new GameClient(terminal);
    
    // Initialize the game
    gameClient.initialize();
    
    // Set up event listeners
    setupEventListeners(terminal, gameClient);
});

/**
 * Set up UI event listeners
 * @param {TerminalUI} terminal - The terminal UI
 * @param {GameClient} gameClient - The game client
 */
function setupEventListeners(terminal, gameClient) {
    // Handle form submissions (commands)
    const commandForm = document.getElementById('command-form');
    if (commandForm) {
        commandForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputElement = document.getElementById('command-input');
            const command = inputElement.value.trim();
            
            if (command) {
                // Process the command
                gameClient.processCommand(command);
                
                // Clear the input field
                inputElement.value = '';
            }
        });
    }
    
    // Handle quick command buttons
    const quickCommands = document.querySelectorAll('.quick-cmd');
    quickCommands.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-cmd');
            if (command) {
                // Process the quick command
                gameClient.processCommand(command);
                
                // Update the input field to show the command
                const inputElement = document.getElementById('command-input');
                if (inputElement) {
                    inputElement.value = command;
                    // Focus the input field after using a quick command
                    inputElement.focus();
                }
            }
        });
    });
}
