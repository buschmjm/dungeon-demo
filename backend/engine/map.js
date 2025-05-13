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
 * The main path from entrance to boss is guaranteed via a biased random walk.
 * Side branches and optional rooms are carved off the main path.
 */

// Possible room types for side branches and fillers
const ROOM_TYPES = [
  'miscRoom', 'armory', 'treasureRoom', 'trapRoom', 'enemyRoom', 'puzzleRoom'
];

/**
 * Builds and returns a dungeon map as a 2D array of strings or null.
 * @param {number} mapSize  The dimension of the square grid.
 * @returns {(string|null)[][]}  The completed map layout.
 */
export function buildMapMatrix(mapSize) {
  // 1. Initialize empty grid
  const mapMatrix = Array.from({ length: mapSize }, () =>
    Array(mapSize).fill(null)
  );

  // 2. Place entrance and boss anchors
  const entrance = { y: 0, x: Math.floor(Math.random() * mapSize) };
  const boss =    { y: mapSize - 1, x: Math.floor(Math.random() * mapSize) };
  mapMatrix[entrance.y][entrance.x] = 'entrance';
  mapMatrix[boss.y][boss.x] = 'boss';

  // 3. Carve guaranteed main path via biased random walk
  const mainPath = [];
  let current = { ...entrance };
  mainPath.push({ ...current });

  while (current.y !== boss.y || current.x !== boss.x) {
    const dy = boss.y - current.y;
    const dx = boss.x - current.x;
    // 70% chance to move vertically toward boss, else horizontal
    if (Math.random() < 0.7 && dy !== 0) {
      current.y += Math.sign(dy);
    } else if (dx !== 0) {
      current.x += Math.sign(dx);
    } else {
      // fallback if dx is 0 but random chose horizontal
      current.y += Math.sign(dy);
    }
    // Mark corridor if not already set
    if (!mainPath.some(p => p.y === current.y && p.x === current.x)) {
      mainPath.push({ y: current.y, x: current.x });
      if (mapMatrix[current.y][current.x] === null) {
        mapMatrix[current.y][current.x] = 'corridor';
      }
    }
  }

  // 4. Add side branches off the main path
  mainPath.forEach(cell => {
    // 30% chance to create a branch here
    if (Math.random() < 0.3) {
      const branchDir = [[-1,0],[1,0],[0,-1],[0,1]][
        Math.floor(Math.random() * 4)
      ];
      const branchLen = 2 + Math.floor(Math.random() * 3); // 2-4 cells
      let pos = { ...cell };
      for (let i = 0; i < branchLen; i++) {
        pos.y += branchDir[0];
        pos.x += branchDir[1];
        if (
          pos.y < 0 || pos.y >= mapSize ||
          pos.x < 0 || pos.x >= mapSize ||
          mapMatrix[pos.y][pos.x] !== null
        ) break;
        // Place a random room type
        mapMatrix[pos.y][pos.x] = ROOM_TYPES[
          Math.floor(Math.random() * ROOM_TYPES.length)
        ];
      }
    }
  });

  return mapMatrix;
}
