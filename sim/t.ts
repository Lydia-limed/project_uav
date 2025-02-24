// -*- coding: utf-8 -*-
// %%
import dns from 'dns';
import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
import QuickChart from 'quickchart-js'; // Import QuickChart

// %%
const random = require('lodash.random');

// %%
// 🔄 Désactiver le cache DNS pour éviter une accélération des requêtes
dns.setDefaultResultOrder('ipv4first');


// %%
import { evaluateAuthentication } from './authentication_evaluation';

// %%
// Chemins des fichiers
const GRAPH_DIR = path.join(__dirname, 'graph_rounds');

// %%
// Paramètres de simulation
const NUM_ROUNDS = 10;

// %%
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

// %% [markdown]
// async function runMobileSimulation(numNodes: number) {
//     let activatedResponseTimes: number[] = [];
//     let deactivatedResponseTimes: number[] = [];
//     let nonAuthenticatedResponseTimes: number[] = [];
//     const graph = new Graph();

// %% [markdown]
//     for (let round = 1; round <= NUM_ROUNDS; round++) {
//         loadGraphFromFile(graph, round);
//         console.log(`🔄 Round ${round} :`);
//         let roundTime = 0;
//         const sortedNodes = Array.from(graph.nodes()).sort();

// %% [markdown]
//         for (let i = 0; i < numNodes; i++) {
//             const node = sortedNodes[i];
//             const did = graph.getNodeAttribute(node, "did");

// %% [markdown]
//             if (!did) continue;

// %% [markdown]
//             try {
//                 const result = await evaluateAuthentication(did);

// %% [markdown]
//                 if (result.status === 1) { // DID activé
//                     activatedResponseTimes.push(parseFloat(result.computationalDelay));
//                 } else if (result.status === 0) { // DID désactivé
//                     deactivatedResponseTimes.push(parseFloat(result.computationalDelay));
//                 } else { // DID non authentifié
//                     nonAuthenticatedResponseTimes.push(parseFloat(result.computationalDelay));
//                     console.log(` nœud ${node}:`, did ,":", result.computationalDelay);
//                 }

// %% [markdown]
//             } catch (error) {
//                 console.error(`❌ Erreur lors de l'authentification du nœud ${node}:`, error);
//             }
//         }
//     }

// %%
//     return {
//         activatedResponseTimes,
//         deactivatedResponseTimes,
//         nonAuthenticatedResponseTimes
//     };
// }
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

// %%
async function testMultipleNodeConfigs() {
    const avgResponseTimes = await runMobileSimulation(50);

    console.log("📊 Délais moyens :");
    console.log("📊 Délais moyens activés:", avgResponseTimes.activatedResponseTimes);
    console.log("📊 Délais moyens désactivés:", avgResponseTimes.deactivatedResponseTimes);
    console.log("📊 Délais moyens non authentifiés:", avgResponseTimes.nonAuthenticatedResponseTimes);

    // Générer le graphique avec QuickChart
    generateQuickChart(
        avgResponseTimes.activatedResponseTimes,
        avgResponseTimes.deactivatedResponseTimes,
        avgResponseTimes.nonAuthenticatedResponseTimes
    );
}

// %%
// Fonction pour générer le graphique avec QuickChart
function generateQuickChart(activatedData: number[], deactivatedData: number[], nonAuthenticatedData: number[]) {
    const chart = new QuickChart();

    chart.setConfig({
        type: 'line',
        data: {
            labels: Array.from({ length: NUM_ROUNDS }, (_, i) => `Round ${i + 1}`), // Labels pour chaque round
            datasets: [
                {
                    label: 'DIDs Activés',
                    data: activatedData,
                    borderColor: 'rgba(0, 255, 0, 1)', // Vert pour activés
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'DIDs Désactivés',
                    data: deactivatedData,
                    borderColor: 'rgba(255, 0, 0, 1)', // Rouge pour désactivés
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'DIDs Non Authentifiés',
                    data: nonAuthenticatedData,
                    borderColor: 'rgba(255, 255, 0, 1)', // Jaune pour non authentifiés
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Rounds'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temps de Réponse (ms)'
                    }
                }
            }
        }
    });

    // Générer l'image du graphique
    chart.toFile('computational_delay_chart.png').then(() => {
        console.log('📊 Le graphique a été généré et enregistré sous "computational_delay_chart.png".');
    }).catch((error) => {
        console.error('❌ Erreur lors de la génération du graphique:', error);
    });
}

// %%
// Lancer la simulation
testMultipleNodeConfigs();

// %%
console.log("🔄 Simulation en cours...")
