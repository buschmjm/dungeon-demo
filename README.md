# Dungeon Demo

A text-based adventure game with a simple frontend-backend architecture. The frontend provides a command prompt interface for user input/output, while the backend handles all game logic.

## Architecture

- **Frontend**: Simple command prompt interface
- **Backend**: Game logic and state management

## Project Structure

```
dungeon-demo/
├── frontend/                  # Simple frontend implementation
│   ├── css/                   # CSS styles for terminal interface
│   │   └── styles.css         # Main stylesheet
│   ├── js/                    # Frontend JavaScript
│   │   ├── gameClient.js      # Handles communication with backend
│   │   ├── main.js            # Main entry point
│   │   └── terminalUI.js      # Terminal UI components
│   └── index.html             # Main HTML page
│
├── backend/                   # Backend implementation
│   └── gameAPI.js             # API for handling input/output between frontend-backend
```

## Getting Started

1. Open `frontend/index.html` in a web browser
2. Implement all game logic in the backend

## Frontend-Backend Communication

The frontend communicates with the backend through the `gameAPI.js` file, which exposes two main functions:

- `initializeGame()` - Sets up the initial game state and returns welcome messages
- `processCommand(command, gameState)` - Takes a user command and current game state, processes it, and returns updated state with response messages
