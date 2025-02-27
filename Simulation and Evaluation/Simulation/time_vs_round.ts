import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
import { evaluateAuthentication } from '../Evaluation/authentication_evaluation';

// File paths
const GRAPH_DIR = path.join(__dirname, '../Graphs/graph_rounds');

// Simulation parameters
const NUM_ROUNDS = 10;

/**
 * Load a graph from a JSON file, ensuring no filesystem cache is used.
 */
function loadGraphFromFile(graph: Graph, round: number) {
    const filePath = path.join(GRAPH_DIR, `graph_round_${round}.json`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ File ${filePath} not found!`);
        process.exit(1);
    }

    // Force reading to avoid filesystem caching
    const graphData = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));

    graph.clear();
    graphData.nodes.forEach((node: any) => graph.addNode(node.id, node.attributes));
    graphData.edges.forEach((edge: any) => graph.addEdge(edge.source, edge.target));
}

/**
 * Run the simulation with `numNodes` UAVs.
 */
async function runMobileSimulation(numNodes: number) {  
    let responseTimes: number[] = [];
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
                console.error(`❌ Error during authentication of node ${node}:`, error);
            }
        }

        responseTimes.push(Number((roundTime / numNodes).toFixed(2)));
    }

    const avgComputationalDelay = Number((responseTimes.reduce((sum, time) => sum + time, 0) / NUM_ROUNDS).toFixed(0));
    // console.log(`\n📊 Average response time for ${numNodes} UAVs: ${avgComputationalDelay} ms`);

 

    return responseTimes;
}

export async function testMultipleNodeConfigs(): Promise<number[]> {
    let lastResult: number[] = [];

    for (let i = 0; i < 5; i++) {
        lastResult = await runMobileSimulation(50); 
        const overallAvgTime = Number((lastResult.reduce((sum, time) => sum + time, 0) / lastResult.length).toFixed(2));
        console.log(`📊 Overall average response time: ${overallAvgTime} ms`);
    }

    return lastResult; 
}
testMultipleNodeConfigs()


