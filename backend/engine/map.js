/**
 * Dungeon Map Generator (Structure Only)
 * 
 * This file defines the layout of rooms and hallways in the dungeon.
 * It is only responsible for generating and storing the structural map — 
 * no movement logic, no player interaction, and no room content exists here.
 * 
 * Each cell in the map represents a single space in the dungeon grid:
 * either a room, a hallway, or empty space. This structure will be used
 * later by other systems to manage navigation, description, and features.
 * 
 * This module exports a function that builds the layout and returns it
 * as a 2D array. Additional utility functions may be added if needed,
 * but no command processing or player logic should be included here.
 */

// Step 1: Define the dungeon grid size.
// - Choose a grid dimension (e.g., 10x10).
// - Create a 2D array to represent the map layout.
// - Fill every cell with null or a placeholder value like "empty".
let mapSize = 6;
let roomTypes = [];


function buildMapMatrix(mapSize) {
  let mapMatrix = [];
  for (let i = 0; i < mapSize; h++) {
    mapMatrix[i] = [];
    for (let h = 0; h < mapSize; h++) {
        mapMatrix[i][h] = null;
    }
  }
    mapMatrix[mapSize - 1][Math.floor(Math.random() * mapSize)] = "boss"; 
    mapMatrix[0][Math.floor(Math.random() * mapSize)] = "entrance";
    for (let j = 0; j < mapSize; j++){
      for (var k = 0; k < list.length; k++) {
        currentRoom = mapMatrix[j][k]
        let adjacentSpaces = [
          [j - 1, k], // North
          [j + 1, k], // South
          [j, k - 1], // West
          [j, k + 1] // East
          ];
          
          for (let [y, x] of adjacentSpaces) {
            
          }
          
        if ((currentRoom == null) && ()
      }
    
    return mapMatrix;
}

// Step 2: Place the start and end points.
// - Place a room of type "entrance" near the top row (e.g., map[0][5]).
// - Place a room of type "boss" near the bottom row (e.g., map[9][5]).
// - These are your fixed anchor points for the dungeon layout.

// Step 3: Build the main path between entrance and boss.
// - Start from the entrance and generate a connected path of rooms/hallways toward the boss room.
// - Favor downward movement, but allow some left/right deviation.
// - Ensure each step connects to the previous one (no gaps or teleporting).
// - Stop once the boss room coordinates are reached.
// - This guarantees the dungeon can always be completed.

// Step 4: Add misleading or optional paths.
// - Loop through some cells in the main path and randomly branch off side paths.
// - These paths should sometimes end in dead ends, loop back to earlier rooms, or trail into empty space.
// - These are designed to obscure the true route and give the dungeon a sense of depth and exploration.
// - Limit the size of side paths to avoid cluttering the map.

// Step 5: Return the generated layout.
// - Once all rooms and hallways are placed, return the 2D array.
// - This structure will be passed into the game state in `state.js`.

// Notes:
// - Room content (descriptions, enemies, traps, etc.) will be handled later by a separate system.
// - Movement and command handling (e.g., “go north”) will be handled elsewhere in the engine.
// - This file’s responsibility is to ensure the structural layout of the dungeon feels logical, connected, and maze-like — without relying on randomness alone.
