import dns from 'dns';
import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
const random = require('lodash.random');

// 🔄 Désactiver le cache DNS pour éviter une accélération des requêtes
dns.setDefaultResultOrder('ipv4first');

// 🗑️ Effacer le cache des modules
delete require.cache[require.resolve('../Evaluation/authentication_evaluation')];
import { evaluateAuthentication } from '../Evaluation/authentication_evaluation';

import { generateChart } from "../Charts_Generation/Delay_Vs_nodes_paral";


// Chemins des fichiers

const GRAPH_DIR = path.join(__dirname, '../Graphs/graph_rounds');

// Paramètres de simulation
const NUM_ROUNDS = 10;


/**
 * Charger un graphe depuis un fichier JSON en désactivant le cache FS
 */
function loadGraphFromFile(graph: Graph, round: number) {
    const filePath = path.join(GRAPH_DIR, `graph_round_${round}.json`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier ${filePath} introuvable !`);
        process.exit(1);
    }

    // 🔄 Lecture forcée pour éviter le cache du système de fichiers
    const graphData = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));

    graph.clear();
    graphData.nodes.forEach((node: any) => graph.addNode(node.id, node.attributes));
    graphData.edges.forEach((edge: any) => graph.addEdge(edge.source, edge.target));
}

/**
 * Exécuter la simulation avec `numNodes` UAVs
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
                console.error(`❌ Erreur lors de l'authentification du nœud ${node}:`, error);
            }
        }

        responseTimes.push(Number((roundTime / numNodes).toFixed(2)));
    }

    const avgComputationalDelay = Number((responseTimes.reduce((sum, time) => sum + time, 0) / NUM_ROUNDS).toFixed(0));
    console.log(`\n📊 Temps de réponse moyen pour ${numNodes} UAVs : ${avgComputationalDelay} ms`);

    // 🗑️ Forcer la libération de la mémoire après chaque run
    if (global.gc) global.gc();

    return responseTimes;
}




async function testMultipleNodeConfigs() {
    const nodesConfig = [10,20,30,40,50];  // Différentes tailles de réseau
    console.log("🚀 Début des tests en parallèle avec différentes tailles de réseau...\n");

    // 🔄 Lancer toutes les simulations en parallèle
    const results = await Promise.all(nodesConfig.map(async (numNodes) => {
        console.log(`\n🔄 Lancement du test avec ${numNodes} UAVs...`);
        const avgDelay = await runMobileSimulation(numNodes);
        const avg = avgDelay.reduce((sum, time) => sum + time, 0) / avgDelay.length;
        console.log(`📊 Temps de réponse moyen pour ${numNodes} UAVs : ${avg.toFixed(2)} ms`);
        return avg;
    }));

    console.log("\n📊 Tous les tests sont terminés !");
    
    // ✅ Générer le graphique avec les résultats
    generateChart(nodesConfig, results);
}

// Lancer la simulation
testMultipleNodeConfigs();
