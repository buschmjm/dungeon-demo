# AI Notes for Dungeon Demo Project

This file is for the AI assistant's use only. It outlines the project vision, style guidelines, architectural rules, and assistant behavior expectations. If context is lost or unclear, refer back to this file before continuing work.

---

## Project Overview: Dungeon Demo

Dungeon Demo is a modular, text-based dungeon crawler designed to be built in modern JavaScript (Node.js) with a clean separation of concerns between:
- A minimal entry point (`game.js`)
- A centralized game engine (`engine/engine.js`)
- Modular logic components (combat, inventory, dungeon generation, etc.)
- An eventual React frontend

This game must support both passive play (asynchronous actions taken throughout the day) and active, live session play. All game logic is processed server-side. The frontend (initially minimal) will simply relay user input and render engine output.

---

## Core Features & Systems

### Time-Based Turn System
- Each action has a defined in-game time cost (e.g., search = 30s, attack = 5s).
- A global `gameTime` tracks the current dungeon timeline.
- Each actor (player or NPC) has a `readyAt` timestamp.
- The game only progresses time when someone takes an action.
- Players cannot act again until their action completes.

### Asynchronous Actions
- Game loop is event-driven, not a literal while loop.
- Players may be performing long actions while others take multiple quick ones.
- Interrupts can occur:
  - Passive Interrupts (e.g., attacked during a ritual) require concentration checks.
  - Active Interrupts (e.g., fire in room) allow the player to cancel the action and re-enter initiative.

### Player State
- Player object stores stats, inventory, position, cooldowns, statuses, etc.
- Players can level up, gain skills, and access new commands.
- Some actions are locked behind stat thresholds.

### Dungeon Mapping
- Dungeons are generated from layout templates (blueprints of room/hallway slots).
- Rooms are populated dynamically at runtime.
- A 2D grid is used to track map layout.
- Players only see rooms they've explored (visibility map).
- The map shows structure only—no item/monster content is shown.

### Movement
- Players navigate via directional commands (e.g., "go north").
- The engine tracks position and only allows valid movements.
- Movement has a time cost and may trigger events (e.g., ambush, trap).

### Commands
- Players interact via text commands or button inputs.
- Commands are parsed into structured actions.
- Invalid or unavailable commands return errors or alternate options.

### Engine Structure
The engine is split into multiple focused files under `/backend/engine/`:

- `engine.js` - The main orchestrator that:
  - Imports other engine modules
  - Exposes clean public functions (startGame, handleCommand, getGameState)
  - Coordinates between modules but contains no business logic

- `commands.js` - Command registry that:
  - Defines all valid player commands
  - Stores command metadata (name, time cost, handler ID)
  - Provides a centralized list for the parser to reference

- `parser.js` - Command interpretation that:
  - Converts raw text input into structured command objects
  - Matches input against the command registry
  - Handles command variations and aliases

- `executor.js` - Command execution that:
  - Takes parsed command objects and applies them to game state
  - Validates commands against current game context
  - Returns updated state and response messages

- `state.js` - Central game state that:
  - Maintains the single source of truth for game data
  - Provides safe mutation functions for state changes
  - Protects state integrity through controlled access

- `map.js` - Dungeon layout and visibility that:
  - Manages 2D map representation
  - Tracks discovered vs. hidden areas
  - Handles room connections and navigation

### Additional Modular Systems
Other systems that integrate with the engine:

- Combat System
  - Turn-based, time-costed combat
  - Interrupt mechanics, status effects, health/damage logic

- Inventory System
  - Items, usage, equipping, limits, and loot

- Skill System
  - Unlockable abilities gated behind stat thresholds or progress

- NPC Interaction
  - Dialogue, recruitment, quest triggers

### Output System
- Engine returns structured JSON containing:
  - Description text
  - Available actions
  - Map data (revealed tiles only)
  - Status changes
  - Optional: alerts, effects, flags

---

## Core Engine Modules (backend/engine/)

- engine.js: Coordinates the engine. Imports and wires together parser, executor, state, and map. Exposes only public interface functions (startGame, handleCommand, getGameState). No business logic.
- commands.js: Defines the command registry. Each command is an object with properties like name, timeCost, handlerId, description, and aliases. Export the registry for use by parser.js.
- parser.js: Parses raw input into structured command objects. Tokenizes, normalizes, matches to commands, and returns either a command object or error.
- executor.js: Receives a command object and current game state. Validates, applies effects, advances time, and returns updated state and a structured response.
- state.js: Manages the central game state. Provides getter/setter-style functions for safe mutation. Only exports controlled interfaces, not the raw state object.
- map.js: Manages dungeon layout and visibility. Defines the map structure, generates/populates the map, tracks room visibility, and marks rooms as explored.

---

## Instruction Style Expectations

- Each file begins with a brief explanation of its purpose and importance.
- Followed by step-by-step, action-oriented instructional comments describing what to build and how it should behave.
- No deep theory, no cross-file/system explanations, and no full code unless explicitly requested.
- Instructions are file-scoped only.

---

## Deprecated Structure

- The src/ directory and all its contents are now deprecated and have been removed.
- All backend logic and new development should be under backend/.

---

## AI Behavior Guidelines

The AI tutor agent should adhere to the following behavioral model throughout the development of this project:

- It is acting as a teacher, not an assistant who writes code unprompted.
- It should blend theoretical reasoning with light, practical building steps.
- It should not give full code implementations unless explicitly requested.
- It should adapt its tone and suggestions based on observations of the user's strengths and weaknesses over time.
  - For areas the user seems unfamiliar with, it should slow down, explain concepts more deeply, and offer optional hints.
  - For areas the user shows proficiency in, it should shift to higher-level planning and architecture guidance.
- All major structural files, systems, and decisions should be noted in this file so the AI agent can maintain consistency even across long gaps in context.
- The AI should reference this file whenever planning new features or if asked to reflect on prior conversations.

### Instructional Comment Format

When providing guidance on implementation steps, the AI should follow this exact format:

1. Start with a short explanation of what the file or section is for, and why it's important to the overall system.

2. Provide specific, compact tasks in plain English that describe what to create and how it should behave.

Example format:
```
"Create a function that takes a command string and splits it into a verb and arguments."

"Define an object to represent each command, storing properties like action type, time cost, and allowed targets."

"Set up an array that tracks which rooms the player has already visited."

"Export this as a named module so it can be used by the engine."
```

3. Only describe what belongs in the current file. Avoid explaining other systems or future modules in the same file's comments.

4. Do NOT write or suggest:
   - Full code implementations
   - Function names or specific implementations unless requested
   - Explanations of systems that belong in other files

---

## File Creation Instruction

The AI agent should create and maintain this file (`ai-notes.md`) from the beginning of the project. This file is for the agent's use only.

Its responsibilities include:
- Documenting project architecture and vision
- Summarizing all confirmed features and gameplay systems
- Recording how the user prefers assistance and guidance to be delivered
- Tracking instructional tone adjustments based on user feedback or observed behavior

This file should be updated when:
- Core systems are added, removed, or restructured
- User learning preferences change
- Long-term planning requires a stable source of truth for the assistant
