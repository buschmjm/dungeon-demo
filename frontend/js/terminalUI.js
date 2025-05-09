/**
 * Terminal UI class - Handles the user interface elements
 */

export class TerminalUI {
    /**
     * Create a new Terminal UI
     * @param {Object} elements - DOM elements for the UI
     */
    constructor(elements) {
        this.outputElement = elements.outputElement;
        this.inputElement = elements.inputElement;
        this.formElement = elements.formElement;
        this.statsElement = elements.statsElement;
        this.inventoryElement = elements.inventoryElement;
        
        // Initial state
        this.isGameRunning = false;
    }
    
    /**
     * Display a message in the terminal
     * @param {string} message - The message to display
     * @param {string} className - Optional CSS class for styling
     */
    displayMessage(message, className = '') {
        if (!this.outputElement) return;
        
        const p = document.createElement('p');
        p.textContent = message;
        
        if (className) {
            p.className = className;
        }
        
        this.outputElement.appendChild(p);
        
        // Auto-scroll to the bottom
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    
    /**
     * Display multiple messages
     * @param {string[]} messages - Array of messages
     * @param {string} className - Optional CSS class for styling
     */
    displayMessages(messages, className = '') {
        if (!messages || !Array.isArray(messages)) return;
        
        messages.forEach(message => {
            this.displayMessage(message, className);
        });
    }
    
    /**
     * Display command input by the player
     * @param {string} command - The command entered
     */
    displayCommand(command) {
        this.displayMessage(`> ${command}`, 'command');
    }
    
    /**
     * Clear the terminal output
     */
    clearOutput() {
        if (this.outputElement) {
            this.outputElement.innerHTML = '';
        }
    }
    
    /**
     * Update player stats display
     * @param {Object} stats - Player stats object
     */
    updateStats(stats) {
        if (!this.statsElement || !stats) return;
        
        // Update name
        if (stats.name && this.statsElement.name) {
            this.statsElement.name.textContent = stats.name;
        }
        
        // Update health
        if (stats.health !== undefined && stats.maxHealth !== undefined && this.statsElement.health) {
            this.statsElement.health.textContent = `${stats.health}/${stats.maxHealth}`;
        }
        
        // Update level
        if (stats.level !== undefined && this.statsElement.level) {
            this.statsElement.level.textContent = stats.level;
        }
        
        // Update experience
        if (stats.experience !== undefined && 
            stats.experienceToNextLevel !== undefined && 
            this.statsElement.xp) {
            this.statsElement.xp.textContent = `${stats.experience}/${stats.experienceToNextLevel}`;
        }
        
        // Update weight if available
        if (stats.currentWeight !== undefined && 
            stats.maxCarryWeight !== undefined && 
            this.statsElement.weight) {
            this.statsElement.weight.textContent = `${stats.currentWeight}/${stats.maxCarryWeight}`;
        }
    }
    
    /**
     * Update inventory display
     * @param {Array} inventory - Array of inventory items
     */
    updateInventory(inventory) {
        if (!this.inventoryElement || !inventory) return;
        
        // Clear current inventory display
        this.inventoryElement.innerHTML = '';
        
        if (inventory.length === 0) {
            // No items
            const emptyText = document.createElement('p');
            emptyText.textContent = 'Empty';
            emptyText.className = 'empty-inventory';
            this.inventoryElement.appendChild(emptyText);
        } else {
            // Create a list of items
            inventory.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';
                itemElement.textContent = item.name;
                
                if (item.equipped) {
                    itemElement.classList.add('equipped');
                    itemElement.textContent += ' (equipped)';
                }
                
                this.inventoryElement.appendChild(itemElement);
            });
        }
    }
    
    /**
     * Enable or disable the input field
     * @param {boolean} enabled - Whether input should be enabled
     */
    setInputEnabled(enabled) {
        if (this.inputElement) {
            this.inputElement.disabled = !enabled;
            
            if (enabled) {
                this.inputElement.focus();
            }
        }
    }
}
