import { initializeGame } from "../gameAPI";
import parser from "./parser.js";
import executor from "./executor.js";
import state from "./state.js";
import map from "./map.js";
import commands from "./commands.js";
import parser from "./parser.js";

// ENGINE SETUP: See the step-by-step instructions in state.js for the full build order and file sequence.
// This file should only contain the functions and imports described in those steps.
let userInput = "";

initializeGame();{
    processCommand(command, state, player);
}
