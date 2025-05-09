<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Dungeon Demo Text Adventure Game Project

This is a text-based adventure game project with the following components:

- A frontend interface in the `frontend` directory
- A backend game engine to be implemented in the `backend` directory

## Project Features

- **Procedural Dungeon Generation**: The game uses weighted random generation to create dungeon layouts, room descriptions, monsters, and treasures
- **Inventory Management**: Players can collect items with weight limits
- **Stat-Based Combat**: Combat uses character stats and equipped items
- **Skill System**: Characters have skills that improve with use
- **Leveling System**: Characters gain experience and level up

## Code Patterns

- Use ES modules (`import`/`export`) for JavaScript files
- Follow object-oriented patterns for game classes
- Use consistent documentation with JSDoc comments
- Maintain clear separation between frontend and backend code
- Use the gameAPI.js file as the sole communication point between frontend and backend

## Development Focus

- Maintainable game architecture
- Easy extensibility for adding new game features
- Clear separation of concerns

The project is designed for future Node.js integration, so any solutions should maintain compatibility with server-side JavaScript.
