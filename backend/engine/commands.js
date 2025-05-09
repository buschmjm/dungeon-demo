/**
 * Command Registry
 * 
 * This file defines all valid player commands for the game. It provides a single source of truth for what actions are available.
 */

// Define an array or object to hold command definitions. Each command should include:
// - name: the command word (e.g., "go", "take", "attack")
// - timeCost: how much in-game time the action takes
// - handlerId: which handler will process this command
// - description: a short explanation of what the command does
// - aliases: alternative words or shortcuts for the command

// Add entries for movement, interaction, combat, and system commands.

// Export the command registry so parser.js can use it to match input to commands.
