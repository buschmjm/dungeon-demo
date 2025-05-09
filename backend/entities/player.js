/**
 * Player - Represents the player character in the game
 * 
 * This class handles player stats, inventory, equipment, and abilities.
 */

/**
 * @class Player
 * @description Player character with stats, inventory and skills
 */
export class Player {
    /**
     * Create a new player
     * @param {string} name - The player's name
     */
    constructor(name = "Adventurer") {
        this.name = name;
        this.health = 100;
        this.maxHealth = 100;
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.currentWeight = 0;
        this.maxCarryWeight = 50;
        
        // Stats
        this.stats = {
            strength: 10,
            dexterity: 10, 
            intelligence: 10,
            constitution: 10
        };
        
        // Equipment slots
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };
        
        // Skills - initially all at level 0
        this.skills = {
            combat: 0,
            magic: 0,
            stealth: 0,
            perception: 0
        };
        
        // Inventory array - will contain Item objects
        this.inventory = [];
    }
    
    /**
     * Add experience points to the player
     * @param {number} amount - Amount of experience to add
     * @returns {boolean} - Whether the player leveled up
     */
    addExperience(amount) {
        this.experience += amount;
        
        // Check for level up
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
            return true;
        }
        
        return false;
    }
    
    /**
     * Level up the player
     */
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // Increase max health
        const healthIncrease = 10 + Math.floor(this.stats.constitution / 2);
        this.maxHealth += healthIncrease;
        this.health = this.maxHealth; // Heal on level up
        
        // Increase max carry weight
        this.maxCarryWeight += 5;
        
        // Skill or stat points could be added here
    }
    
    /**
     * Add an item to the player's inventory
     * @param {Object} item - The item to add
     * @returns {boolean} - Whether the item was successfully added
     */
    addItem(item) {
        // Check if adding this item would exceed carry weight
        if (this.currentWeight + item.weight > this.maxCarryWeight) {
            return false;
        }
        
        // Add the item
        this.inventory.push(item);
        this.currentWeight += item.weight;
        return true;
    }
    
    /**
     * Remove an item from the player's inventory
     * @param {string} itemId - ID of the item to remove
     * @returns {Object|null} - The removed item or null if not found
     */
    removeItem(itemId) {
        const index = this.inventory.findIndex(item => item.id === itemId);
        
        if (index === -1) {
            return null;
        }
        
        const item = this.inventory[index];
        this.inventory.splice(index, 1);
        
        // Update weight
        this.currentWeight -= item.weight;
        
        return item;
    }
    
    /**
     * Equip an item from the inventory
     * @param {string} itemId - ID of the item to equip
     * @returns {boolean} - Whether the item was successfully equipped
     */
    equipItem(itemId) {
        const item = this.inventory.find(item => item.id === itemId);
        
        if (!item || !item.equipable) {
            return false;
        }
        
        // If there's already something equipped in that slot, unequip it first
        if (this.equipment[item.slot]) {
            this.equipment[item.slot].equipped = false;
        }
        
        // Equip the new item
        item.equipped = true;
        this.equipment[item.slot] = item;
        
        return true;
    }
    
    /**
     * Take damage and update health
     * @param {number} amount - Amount of damage to take
     * @returns {boolean} - Whether the player died
     */
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.health = 0;
            return true; // Player died
        }
        
        return false;
    }
    
    /**
     * Heal the player
     * @param {number} amount - Amount to heal
     */
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    
    /**
     * Increase a skill by using it
     * @param {string} skillName - Name of the skill to increase
     * @param {number} amount - Amount to increase by (default 1)
     */
    improveSkill(skillName, amount = 1) {
        if (this.skills.hasOwnProperty(skillName)) {
            this.skills[skillName] += amount;
        }
    }
    
    /**
     * Convert player to JSON for API responses
     * @returns {Object} - Player data as JSON
     */
    toJSON() {
        return {
            name: this.name,
            health: this.health,
            maxHealth: this.maxHealth,
            level: this.level,
            experience: this.experience,
            experienceToNextLevel: this.experienceToNextLevel,
            currentWeight: this.currentWeight,
            maxCarryWeight: this.maxCarryWeight,
            stats: { ...this.stats },
            skills: { ...this.skills },
            inventory: this.inventory.map(item => ({ ...item })),
            equipment: {
                weapon: this.equipment.weapon ? { ...this.equipment.weapon } : null,
                armor: this.equipment.armor ? { ...this.equipment.armor } : null,
                accessory: this.equipment.accessory ? { ...this.equipment.accessory } : null
            }
        };
    }
}
