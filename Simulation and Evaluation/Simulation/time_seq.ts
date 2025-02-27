import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
import { evaluateAuthentication } from '../Evaluation/authentication_evaluation';

const GRAPH_DIR = path.join(__dirname, '../Graphs/graph_rounds');
const NUM_ROUNDS = 10; // Number of simulation rounds

/**
 * Load a graph from a JSON file.
 * @param {Graph} graph - The graph instance to populate.
 * @param {number} round - The round number to load the corresponding graph.
 */
function loadGraphFromFile(graph: Graph, round: number) {
    const filePath = path.join(GRAPH_DIR, `graph_round_${round}.json`);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }

    const graphData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    graph.clear();
    graphData.nodes.forEach((node: any) => graph.addNode(node.id, node.attributes));
    graphData.edges.forEach((edge: any) => graph.addEdge(edge.source, edge.target));
}

/**
 * Run the simulation for a given number of UAV nodes.
 * @param {number} numNodes - The number of UAV nodes.
 * @returns {Promise<number[]>} - Array of average response times per round.
 */
async function runMobileSimulation(numNodes: number): Promise<number[]> {
    const responseTimes: number[] = [];
    const graph = new Graph();

    for (let round = 1; round <= NUM_ROUNDS; round++) {
        loadGraphFromFile(graph, round);
        let roundTime = 0;
        const sortedNodes = Array.from(graph.nodes()).sort();

        for (let i = 0; i < numNodes; i++) {
            const node = sortedNodes[i];
            const did = graph.getNodeAttribute(node, "did");
            if (!did) continue;

            try {
                const result = await evaluateAuthentication(did);
                if (result.computationalDelay !== undefined) {
                    roundTime += parseFloat(result.computationalDelay);
                }
            } catch (error) {
                console.error(`❌ Error authenticating node ${node}:`, error);
            }
        }

        responseTimes.push(Number((roundTime / numNodes).toFixed(2)));
    }

    return responseTimes;
}

/**
 * Run multiple simulations with different UAV configurations.
 * @returns {Promise<{ nodesConfig: number[], delays: number[] }>} - Object containing node configurations and delays.
 */
export async function testMultipleNodeConfigs(): Promise<{ nodesConfig: number[], delays: number[] }> {
    const nodesConfig = [10, 20, 30, 40, 50];
    const delays: number[] = [];

    for (const numNodes of nodesConfig) {
        const avgDelay = await runMobileSimulation(numNodes);
        const avg = avgDelay.reduce((sum, time) => sum + time, 0) / avgDelay.length;
        delays.push(avg);

        console.log(`✔️ ${numNodes} UAVs: ${avg.toFixed(2)} ms`);
    }

    return { nodesConfig, delays };
}

testMultipleNodeConfigs()
