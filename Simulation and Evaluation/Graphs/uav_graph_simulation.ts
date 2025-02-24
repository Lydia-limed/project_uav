import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
const random = require('lodash.random');

// File paths
const DID_FILE = path.join(__dirname, 'dids.json');
const GRAPH_DIR = path.join(__dirname, 'graph_rounds');

// Simulation parameters
const NUM_NODES = 50; // Number of UAVs
const NUM_EDGES = 4;  // Number of connections per UAV
const NUM_ROUNDS = 10; // Number of simulation rounds

// Ensure the graph directory exists
if (!fs.existsSync(GRAPH_DIR)) {
    fs.mkdirSync(GRAPH_DIR);
}

// Function to retrieve stored DIDs
function getStoredDIDs(): string[] {
    if (!fs.existsSync(DID_FILE)) {
        console.error("❌ The dids.json file is missing!");
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(DID_FILE, 'utf8'));
}

// Load the DIDs
const dids = getStoredDIDs();
if (dids.length < NUM_NODES) {
    console.error(`❌ Not enough DIDs available (${dids.length} found, ${NUM_NODES} required)`);
    process.exit(1);
}

// Create an empty UAV graph
const graph = new Graph();

/**
 * Check if all round graphs already exist
 */
function checkAllRoundsExist(): boolean {
    for (let round = 1; round <= NUM_ROUNDS; round++) {
        if (!fs.existsSync(path.join(GRAPH_DIR, `graph_round_${round}.json`))) return false;
    }
    return true;
}

/**
 * Load the graph from a JSON file
 */
function loadGraphFromFile(graph: Graph, filePath: string) {
    const graphData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    graph.clear(); // Clear the graph before loading new data

    // Load nodes
    graphData.nodes.forEach((node: any) => graph.addNode(node.id, node.attributes));

    // Load edges
    graphData.edges.forEach((edge: any) => graph.addEdge(edge.source, edge.target));

    console.log(`✅ Graph loaded from ${filePath}`);
}

/**
 * Save the graph to a JSON file
 */
function saveGraphToFile(graph: Graph, filePath: string) {
    const nodes = graph.nodes().map(node => ({
        id: node,
        attributes: graph.getNodeAttributes(node),
    }));
    const edges = graph.edges().map(edge => ({
        source: graph.source(edge),
        target: graph.target(edge),
    }));

    fs.writeFileSync(filePath, JSON.stringify({ nodes, edges }, null, 2), 'utf8');
}

/**
 * Update UAV positions
 */
function updatePositions() {
    graph.forEachNode((node, attributes) => {
        graph.mergeNodeAttributes(node, {
            x: attributes.x + random(-10, 10), 
            y: attributes.y + random(-10, 10)  
        });
    });
}

/**
 * Update connections based on distances between UAVs
 */
function updateConnections() {
    graph.clearEdges();
    graph.forEachNode((node) => {
        const distances: { [key: string]: number } = {};
        graph.forEachNode((otherNode, attributes) => {
            if (node !== otherNode) {
                const dx = attributes.x - graph.getNodeAttribute(node, 'x');
                const dy = attributes.y - graph.getNodeAttribute(node, 'y');
                distances[otherNode] = Math.sqrt(dx * dx + dy * dy);
            }
        });

        const closestNodes = Object.entries(distances)
            .sort((a, b) => a[1] - b[1])
            .slice(0, NUM_EDGES)
            .map(([key]) => key.toString());

        closestNodes.forEach((neighbor) => {
            if (!graph.hasEdge(node, neighbor)) {
                graph.addEdge(node, neighbor);
            }
        });
    });
}

/**
 * Generate the graphs for all rounds
 */
async function generateGraphs() {
    if (checkAllRoundsExist()) {
        console.log("📂 All round graphs exist, loading...");

        for (let round = 1; round <= NUM_ROUNDS; round++) {
            loadGraphFromFile(graph, path.join(GRAPH_DIR, `graph_round_${round}.json`));
        }

    } else {
        console.log("🚀 Generating and saving round graphs...");

        for (let round = 1; round <= NUM_ROUNDS; round++) {
            console.log(`🔄 Generating graph for round ${round}...`);

            if (round === 1) {
                for (let i = 0; i < NUM_NODES; i++) {
                    graph.addNode(i.toString(), { 
                        x: random(0, 100), 
                        y: random(0, 100), 
                        did: dids[i] 
                    });
                }
                updateConnections();
            } else {
                updatePositions();
                updateConnections();
            }

            saveGraphToFile(graph, path.join(GRAPH_DIR, `graph_round_${round}.json`));
        }

        console.log("💾 All round graphs have been saved!");
    }

    console.log("📊 Graph generation completed!");
}

// Run the graph generation
generateGraphs();
