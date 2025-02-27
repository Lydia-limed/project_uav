import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
import { evaluateAuthentication } from '../Evaluation/authentication_evaluation';

// Directory path for graph files
const GRAPH_DIR = path.join(__dirname, '../Graphs/graph_rounds');
const NUM_ROUNDS = 10;

/**
 * Load a graph from a JSON file for a specific round.
 */
function loadGraphFromFile(graph: Graph, round: number) {
    const filePath = path.join(GRAPH_DIR, `graph_round_${round}.json`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ File ${filePath} not found!`);
        process.exit(1);
    }

    const graphData = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));
    graph.clear();
    graphData.nodes.forEach((node: any) => graph.addNode(node.id, node.attributes));
    graphData.edges.forEach((edge: any) => graph.addEdge(edge.source, edge.target));
}

/**
 * Run the mobile network simulation for a given number of UAVs.
 */
async function runMobileSimulation(numNodes: number) {
    const activatedResponseTimes: number[] = [];
    const deactivatedResponseTimes: number[] = [];
    const nonAuthenticatedResponseTimes: number[] = [];
    const graph = new Graph();

    for (let round = 1; round <= NUM_ROUNDS; round++) {
        loadGraphFromFile(graph, round);

        if (round === 1) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pause for stability
        }

        const sortedNodes = Array.from(graph.nodes()).sort();

        for (let i = 0; i < numNodes; i++) {
            const node = sortedNodes[i];
            const did = graph.getNodeAttribute(node, "did");

            if (!did) continue;

            try {
                const result = await evaluateAuthentication(did);

                if (result.status === 1) {
                    activatedResponseTimes.push(parseFloat(result.computationalDelay));
                } else if (result.status === 0) {
                    deactivatedResponseTimes.push(parseFloat(result.computationalDelay));
                } else {
                    nonAuthenticatedResponseTimes.push(parseFloat(result.computationalDelay));
                }
            } catch (error) {
                console.error(`❌ Error authenticating node ${node}:`, error);
            }
        }
    }

    return {
        activatedResponseTimes,
        deactivatedResponseTimes,
        nonAuthenticatedResponseTimes
    };
}

/**
 * Calculate the average value of an array.
 */
function calculateAverage(arr: number[]): number {
    if (arr.length === 0) return 0; 
    return arr.reduce((sum, value) => sum + value, 0) / arr.length;
}

/**
 * Test multiple UAV configurations and return response times.
 */
export async function testMultipleNodeConfigs(): Promise<{ 
    activatedResponseTimes: number[]; 
    deactivatedResponseTimes: number[]; 
    nonAuthenticatedResponseTimes: number[];  
}> {
    const avgResponseTimes = await runMobileSimulation(50);

    // Compute averages
    const avgActivated = calculateAverage(avgResponseTimes.activatedResponseTimes);
    const avgDeactivated = calculateAverage(avgResponseTimes.deactivatedResponseTimes);
    const avgNonAuthenticated = calculateAverage(avgResponseTimes.nonAuthenticatedResponseTimes);

    console.log("📊 Average activated delay:", avgActivated.toFixed(2), "ms");
    console.log("📊 Average deactivated delay:", avgDeactivated.toFixed(2), "ms");
    console.log("📊 Average non-authenticated delay:", avgNonAuthenticated.toFixed(2), "ms");

    return avgResponseTimes;
}

// Run the simulation
testMultipleNodeConfigs();
