/**
 * Game Client - Simple communication with the backend API
 */

export class GameClient {
    /**
     * Create a new Game Client
     * @param {TerminalUI} terminal - The terminal UI
     */
    constructor(terminal) {
        this.terminal = terminal;
        this.gameState = null;
        this.isInitialized = false;
        
        // Path to backend API
        this.apiBasePath = '../backend/';
    }
    
    /**
     * Initialize the game
     */
    async initialize() {
        this.terminal.displayMessage('Initializing game...', 'system');
        
        try {
            // Import the API
            const api = await import(`${this.apiBasePath}gameAPI.js`);
            const response = api.initializeGame();
            
            if (response.success) {
                this.gameState = response.gameState;
                
                // Display welcome messages
                this.terminal.displayMessages(response.messages);
                
                // Update UI with initial game state
                this.updateUI();
                
                this.isInitialized = true;
                this.terminal.setInputEnabled(true);
            } else {
                this.terminal.displayMessage('Failed to initialize game.', 'error');
            }
        } catch (error) {
            console.error('Error initializing game:', error);
            this.terminal.displayMessage('Error initializing game. Check console for details.', 'error');
        }
    }
    
    /**
     * Process a player command
     * @param {string} command - The command to process
     */
    async processCommand(command) {
        if (!this.isInitialized) {
            this.terminal.displayMessage('Game not initialized.', 'error');
            return;
        }
        
        // Display the command in the terminal
        this.terminal.displayCommand(command);
        
        try {
            // Send the command to the backend
            const api = await import(`${this.apiBasePath}gameAPI.js`);
            const response = api.processCommand(command, this.gameState);
            
            if (response.success) {
                // Update game state
                this.gameState = response.gameState;
                
                // Display messages
                this.terminal.displayMessages(response.messages);
                
                // Update UI with new game state
                this.updateUI();
            } else {
                this.terminal.displayMessage('Command failed.', 'error');
            }
        } catch (error) {
            console.error('Error processing command:', error);
            this.terminal.displayMessage('Error processing command. Check console for details.', 'error');
        }
    }
    
    /**
     * Update the UI with the current game state
     */
    updateUI() {
        if (!this.gameState) return;
        
        // Update player stats if available
        if (this.gameState.player) {
            this.terminal.updateStats(this.gameState.player);
        }
        
        // Update inventory if available
        if (this.gameState.player && this.gameState.player.inventory) {
            this.terminal.updateInventory(this.gameState.player.inventory);
        }
    }
}
