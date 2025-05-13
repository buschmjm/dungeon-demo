/**
 * Command Parser
 * 
 * This file converts raw player input into structured command objects for the engine to process.
 */

// ENGINE SETUP: See the step-by-step instructions in state.js for the full build order and file sequence.
// This file should only contain the functions and imports described in those steps.

parseReponse = (input) => {
    if (input === "") {
        return { error: "Input cannot be empty" };
    }
}