/**
 * Command Parser
 * 
 * This file converts raw player input into structured command objects for the engine to process.
 */

// Import the command registry
// This gives the parser access to all valid commands and their properties

// Create a function that accepts a raw input string from the player.
// Tokenize the input into a verb and arguments.
// Normalize aliases and shortcuts (e.g., "n" becomes "go north").
// Match the verb and arguments to a command in the command registry.
// Return the matching command object, or an error object if no match is found.

// Create a function that extracts command arguments
// For commands that need targets, extract the remaining text as arguments
// Handle special cases like "look at sword" vs "look sword"
// Return the arguments as a string or structured object as needed

// Create a function that builds a complete command object
// Take the matched command from the registry
// Add any extracted arguments
// Include the original input for reference
// Return a complete command object ready for execution

// Export the main parsing function for use by the engine.
