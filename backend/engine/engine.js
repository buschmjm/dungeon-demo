import { initializeGame } from "../gameAPI";

// Main Game Engine Coordinator
// This file acts as the public interface for all game logic. It should only import and coordinate the core engine modules (parser, executor, state, map). No business logic belongs here.

// Import the parser, executor, state, and map modules.

// Create a function to start a new game. This should initialize the game state and map by calling the appropriate functions from the state and map modules. Return the initial game state for the frontend.

// Create a function to handle player commands. This should accept raw input, use the parser to convert it to a command object, and then use the executor to apply it to the game state. Return the updated state and a structured response.

// Create a function to safely access the current game state. This should return a read-only or filtered version of the state for the UI.

// Export these functions as the public API for the engine. Do not include any game logic or state mutation in this file.

initializeGame();{

}
