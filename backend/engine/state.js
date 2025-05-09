/**
 * Game State Manager
 * 
 * This file manages the central game state for the entire game session. All state changes must go through this module.
 */

import { initializeGame } from "../gameAPI";

// ENGINE SETUP: STEP-BY-STEP INSTRUCTIONS
// Follow these steps in order, moving between files as directed. Each step builds on the last.

// Step 1: In engine.js, create a function to start a new game session. This should call a function in state.js to set up the initial game state and a function in map.js to generate the dungeon layout. Return the initial game state for the frontend.

// Step 2: In state.js (this file), define a function to initialize and return a new game state object. The state should include at least a player object, a map object, and a time property. Export this function for use by engine.js.

// Step 3: In map.js, create a function to generate a simple dungeon map structure. Use a 2D array or similar structure. Export this function for use by state.js or engine.js.

// Step 4: In engine.js, create a function to process player commands. This function should accept a raw input string and the current game state. It should call the parser in parser.js to convert the input to a command object, then call the executor in executor.js to apply the command. Return the updated state and a response object.

// Step 5: In parser.js, write a function that takes a raw input string and matches it to a command in commands.js. Tokenize the input, normalize it, and return a structured command object or an error. Export this function for use by engine.js.

// Step 6: In commands.js, define a minimal command registry as an array or object. Each command should have at least a name, timeCost, and handlerId. Export the registry for use by parser.js.

// Step 7: In executor.js, create a function that receives a command object and the current game state. Validate if the command is possible (e.g., is the player able to act?). Apply the command’s effects (for now, just update a log or move the player). Advance the game time by the command’s timeCost. Return the updated state and a response object. Export this function for use by engine.js.

// Step 8: In engine.js, create a function to safely return the current game state for the UI. This should provide a filtered or read-only version of the state.

// Step 9: In engine.js, export the three main functions: startGame, handleCommand, and getGameState as the public API for your engine.


const initializeGame = () => {
    var player = "Bob";
    var map = "Dungeon";
    var time = 0;
    return {
        player: player,
        map: map,
        time: time
    };
}

export default initializeGame;