import dns from 'dns';
import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
import { generateChart } from '../Charts_Generation/Delay_Vs_Class';

const random = require('lodash.random');

// 🔄 Désactiver le cache DNS pour éviter une accélération des requêtes
dns.setDefaultResultOrder('ipv4first');


import { evaluateAuthentication } from '../Evaluation/authentication_evaluation';

// Chemins des fichiers
const GRAPH_DIR = path.join(__dirname, '../Graphs/graph_rounds');

// Paramètres de simulation
const NUM_ROUNDS = 10;

function loadGraphFromFile(graph: Graph, round: number) {
    const filePath = path.join(GRAPH_DIR, `graph_round_${round}.json`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier ${filePath} introuvable !`);
        process.exit(1);
    }

    const graphData = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));
    graph.clear();
    graphData.nodes.forEach((node: any) => graph.addNode(node.id, node.attributes));
    graphData.edges.forEach((edge: any) => graph.addEdge(edge.source, edge.target));
}

async function runMobileSimulation(numNodes: number) {
    let activatedResponseTimes: number[] = [];
    let deactivatedResponseTimes: number[] = [];
    let nonAuthenticatedResponseTimes: number[] = [];
    const graph = new Graph();

    for (let round = 1; round <= NUM_ROUNDS; round++) {
        loadGraphFromFile(graph, round);
        console.log(`🔄 Round ${round} :`);
        let roundTime = 0;
        const sortedNodes = Array.from(graph.nodes()).sort();

        // 🌡️ Warmup avant de commencer le premier round
        if (round === 1) {
            console.log("⏳ Initialisation du premier round...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pause pour stabilisation
        }

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

                console.log(` 🏷️ Nœud ${node} (${did}): ${result.computationalDelay}ms`);

            } catch (error) {
                console.error(`❌ Erreur lors de l'authentification du nœud ${node}:`, error);
            }
        }
    }

    return {
        activatedResponseTimes,
        deactivatedResponseTimes,
        nonAuthenticatedResponseTimes
    };
}

async function testMultipleNodeConfigs() {
    const avgResponseTimes = await runMobileSimulation(50);

    console.log("📊 Délais moyens :");
    console.log("📊 Délais moyens activés:", avgResponseTimes.activatedResponseTimes);
    console.log("📊 Délais moyens désactivés:", avgResponseTimes.deactivatedResponseTimes);
    console.log("📊 Délais moyens non authentifiés:", avgResponseTimes.nonAuthenticatedResponseTimes);

    // Générer le graphique avec QuickChart
    generateChart(
        avgResponseTimes.activatedResponseTimes,
        avgResponseTimes.deactivatedResponseTimes,
        avgResponseTimes.nonAuthenticatedResponseTimes,NUM_ROUNDS
    );
}


// Lancer la simulation
testMultipleNodeConfigs();
