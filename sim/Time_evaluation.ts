import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
const random = require('lodash.random');
const { performance: perf } = require('perf_hooks'); 
const { AuthenticateDID } = require('../APIs/Authentication/resolveDid');
import {evaluateAuthentication } from './authentication_evaluation';
import { generateCharts_ComputationalDelay_Vs_round ,generateComputationalDelayChart, generateComputationalDelayChartp} from "./generate_chart";
// Chemin du fichier contenant les DIDs
const DID_FILE = path.join(__dirname, 'dids.json');

// Paramètres de simulation
const NUM_NODES = 50; // Nombre d'UAVs
const NUM_EDGES = 4;  // Nombre de connexions par UAV
const NUM_ROUNDS = 10; // Nombre de rounds de simulation

// Fonction pour récupérer les DIDs stockés
function getStoredDIDs(): string[] {
    if (!fs.existsSync(DID_FILE)) {
        console.error("❌ Le fichier dids.json est introuvable !");
        process.exit(1);
    }
    const data = fs.readFileSync(DID_FILE, 'utf8');
    return JSON.parse(data);
}

// Charger les DIDs
const dids = getStoredDIDs();
if (dids.length < NUM_NODES) {
    console.error(`❌ Pas assez de DIDs disponibles (${dids.length} trouvés, ${NUM_NODES} nécessaires)`);
    process.exit(1);
}

// Création du graphe
const graph = new Graph();

// Initialisation des nœuds UAV avec un DID unique
for (let i = 0; i < NUM_NODES; i++) {
    graph.addNode(i.toString(), { // Convertir i en string
        x: random(0, 100), 
        y: random(0, 100), 
        did: dids[i]  // Association du DID
    });
}

// Fonction pour mettre à jour la position des UAVs (mobilité)
function updatePositions() {
    graph.forEachNode((node, attributes) => {
        graph.mergeNodeAttributes(node, {
            x: attributes.x + random(-10, 10), // Déplacement aléatoire en X
            y: attributes.y + random(-10, 10)  // Déplacement aléatoire en Y
        });
    });
}

// Fonction pour reconstruire les connexions en fonction de la nouvelle position
function updateConnections() {
    graph.clearEdges(); // Supprimer les anciennes connexions

    graph.forEachNode((node) => {
        const distances: { [key: string]: number } = {}; // Utiliser string comme clé

        // Calculer la distance avec tous les autres UAVs
        graph.forEachNode((otherNode, attributes) => {
            if (node !== otherNode) {
                const dx = attributes.x - graph.getNodeAttribute(node, 'x');
                const dy = attributes.y - graph.getNodeAttribute(node, 'y');
                distances[otherNode] = Math.sqrt(dx * dx + dy * dy);
            }
        });

        // Trier les UAVs par distance et connecter aux plus proches
        const closestNodes = Object.entries(distances)
            .sort((a, b) => a[1] - b[1]) // Trier par distance croissante
            .slice(0, NUM_EDGES) // Garder les 4 plus proches
            .map(([key]) => key.toString()); // Convertir en string

        closestNodes.forEach((neighbor) => {
            if (!graph.hasEdge(node, neighbor)) {
                graph.addEdge(node, neighbor);
            }
        });
    });
}



// Coût moyen par round
// async function runMobileSimulation() {

//     let responseTimes: number[] = [];
//     let communicationCosts: number[] = [];

//     for (let round = 1; round <= NUM_ROUNDS; round++) {
//         console.log(`\n🚀 Round ${round} - Mise à jour des positions et connexions...`);

//         updatePositions();
//         updateConnections();

//         let roundTime = 0;
//         let roundCommunicationCost = 0;

//         for (const node of graph.nodes()) {
//             const did = graph.getNodeAttribute(node, "did");
//             if (!did) {
//                 console.error(`❌ Aucun DID attribué au nœud ${node} !`);
//                 continue;
//             }

//             try {
//                 const result = await evaluateAuthentication(did);

//                 if (result.computationalDelay !== undefined) {
//                     roundTime += parseFloat(result.computationalDelay);
//                 }
//                 if (result.communicationCost !== undefined) {
//                     roundCommunicationCost += result.communicationCost;
//                 }

//             } catch (error) {
//                 console.error(`❌ Erreur lors de l'authentification du nœud ${node} :`, error);
//             }
//         }

//         responseTimes.push(roundTime / NUM_NODES); // Temps moyen par round
//         communicationCosts.push(roundCommunicationCost / NUM_NODES); // Coût moyen par round
//     }
// // 🔹 Affichage des moyennes après tous les rounds
// console.log(`\n📊 Temps de réponse moyen après ${NUM_ROUNDS} rounds : ${(totalTime / (NUM_NODES * NUM_ROUNDS)).toFixed(0)} ms`);
// console.log(`📊 Communication Cost moyen après ${NUM_ROUNDS} rounds : ${(totalcommunicationCost / (NUM_NODES * NUM_ROUNDS))} bytes`);

//     // 🔹 Générer et télécharger le graphique
//     await generateCharts_ComputationalDelay_Vs_round(responseTimes);
  
// }

//  runMobileSimulation();
// async function runMobileSimulation() {
//     const NUM_NODES = 50; // Nombre d'UAVs
//     const NUM_EDGES = 4;  // Nombre de connexions par UAV
//     const NUM_ROUNDS = 10; // Nombre de rounds de simulation
//     const DEBUG = false; // Mettre à true pour voir les logs détaillés

//     let totalTime = 0;
//     let totalcommunicationCost = 0; 

//     for (let round = 1; round <= NUM_ROUNDS; round++) {
//         console.log(`\n🚀 Round ${round} - Mise à jour des positions et connexions...`);
        
//         updatePositions();
//         updateConnections();

//         for (const node of graph.nodes()) {
//             const did = graph.getNodeAttribute(node, "did"); // Récupérer le DID du nœud
//             if (!did) {
//                 console.error(`❌ Aucun DID attribué au nœud ${node} !`);
//                 continue;
//             }

//             try {
//                 // 🔹 Attendre le résultat avant d'accéder aux valeurs
//                 const result = await evaluateAuthentication(did);
                
//                 // 🔹 Vérification et accumulation des valeurs
//                 if (result.computationalDelay !== undefined) {
//                     totalTime += parseFloat(result.computationalDelay);
//                 }
//                 if (result.communicationCost !== undefined) {
//                     totalcommunicationCost += result.communicationCost;
//                 }
        
//                 if (DEBUG) console.log(`🔹 Performance du nœud ${node} :`, result);
//             } catch (error) {
//                 console.error(`❌ Erreur lors de l'authentification du nœud ${node} :`, error);
//             }
//         }
//     }

//     // 🔹 Calcul des moyennes après tous les rounds
//     const avgComputationalDelay = totalTime / (NUM_NODES * NUM_ROUNDS);
//     const avgCommunicationCost = totalcommunicationCost / (NUM_NODES * NUM_ROUNDS);

//     console.log(`\n📊 Temps de réponse moyen après ${NUM_ROUNDS} rounds : ${avgComputationalDelay.toFixed(0)} ms`);
//     console.log(`📊 Communication Cost moyen après ${NUM_ROUNDS} rounds : ${avgCommunicationCost.toFixed(2)} bytes`);
// }



// //affiche moyenne de temps de réponse par round et calcule moyenne de temps de reponse pour tous les rounds
// async function runMobileSimulation() {
//     const NUM_NODES = 50;
//     const NUM_ROUNDS = 10;
   

//     let responseTimes: number[] = [];

//     for (let round = 1; round <= NUM_ROUNDS; round++) {
        

//         updatePositions();
//         updateConnections();

//         let roundTime = 0;
//         for (const node of graph.nodes()) {
//             const did = graph.getNodeAttribute(node, "did");
//             if (!did) continue;

//             try {
//                 const result = await evaluateAuthentication(did);
//                 if (result.computationalDelay !== undefined) {
//                     roundTime += parseFloat(result.computationalDelay);
//                 }
//             } catch (error) {
//                 console.error(`❌ Erreur lors de l'authentification du nœud ${node}:`, error);
//             }
//         }

//         // Stocker la moyenne de ce round
//         responseTimes.push(roundTime / NUM_NODES);
//     }

//     // ✅ Calculer et afficher la moyenne des temps de réponse
//     const avgComputationalDelay = responseTimes.reduce((sum, time) => sum + time, 0) / NUM_ROUNDS;
//     console.log(`\n📊 Temps de réponse moyen après ${NUM_ROUNDS} rounds : ${avgComputationalDelay.toFixed(0)} ms`);

//     // ✅ Générer le graphique
//     generateCharts_ComputationalDelay_Vs_round(responseTimes);
// }

// Lancer la simulation mobile UAV
// runMobileSimulation();


async function runMobileSimulation(numNodes: number) {  
    const NUM_ROUNDS = 10;
    let responseTimes: number[] = [];

    console.log(`\n🚀 Simulation avec ${numNodes} UAVs en cours...`);

    for (let round = 1; round <= NUM_ROUNDS; round++) {
        console.log(`\n🚀 Round ${round} - Mise à jour des positions et connexions...`);
        
        updatePositions();
        updateConnections();

        let roundTime = 0;
        for (let i = 0; i < numNodes; i++) {
            const node = graph.nodes()[i]; // Access the node by index
            const did = graph.getNodeAttribute(node, "did");
            if (!did) {
                console.error(`❌ Aucun DID attribué au nœud ${node} !`);
                continue; // Skip this node if it has no DID
            }
        
            try {
                const result = await evaluateAuthentication(did);
                if (result.computationalDelay !== undefined) {
                    roundTime += parseFloat(result.computationalDelay);
                }
            } catch (error) {
                console.error(`❌ Erreur lors de l'authentification du nœud ${node}:`, error);
            }
        }

        // Stocker la moyenne de ce round
        responseTimes.push(roundTime / numNodes);
    }

    // ✅ Calcul de la moyenne des temps de réponse
    const avgComputationalDelay = responseTimes.reduce((sum, time) => sum + time, 0) / NUM_ROUNDS;
    console.log(`\n📊 Temps de réponse moyen après ${NUM_ROUNDS} rounds pour ${numNodes} UAVs : ${avgComputationalDelay.toFixed(0)} ms`);

    // ✅ Générer le graphique Temps vs Round pour ce test
    generateCharts_ComputationalDelay_Vs_round(responseTimes);

    return avgComputationalDelay;
}

async function testMultipleNodeConfigs() {
    const nodesConfig = [10, 20, 30, 40, 50];  // Différents nombres de nœuds à tester
    let delays: number[] = [];

    for (const numNodes of nodesConfig) {
        const avgDelay = await runMobileSimulation(numNodes);
        delays.push(avgDelay);
    }

    // ✅ Générer le graphique Temps vs Nombre de nœuds
    generateComputationalDelayChart(nodesConfig, delays);
}

// Lancer la simulation mobile UAV pour différentes tailles de réseau
testMultipleNodeConfigs();





// teste de plusieur nombre de noeuds en sequentiel
async function runComputationalDelayAnalysis1() {
    const nodesConfig = [10, 20, 30, 40, 50]; // Différents nombres de nœuds testés
    let delays: number[] = [];
    let costs: number[] = [];

    for (const numNodes of nodesConfig) {
        console.log(`\n🚀 Simulation avec ${numNodes} nœuds...`);

        // 🔹 Création du graphe avec numNodes UAVs
        const graph = new Graph();
        const dids = getStoredDIDs();
        
        for (let i = 0; i < numNodes; i++) {
            graph.addNode(i.toString(), { 
                x: random(0, 100), 
                y: random(0, 100), 
                did: dids[i]
            });
        }

        let totalDelay = 0;
        let totalcommunicationCost = 0;

        for (let round = 1; round <= NUM_ROUNDS; round++) {
            console.log(`📡 Round ${round} - Simulation en cours...`);
            
            updatePositions();
            updateConnections();

            for (const node of graph.nodes()) {
                const did = graph.getNodeAttribute(node, "did");
                if (!did) continue;

                try {
                    const result = await evaluateAuthentication(did);
                    if (result.computationalDelay !== undefined) {
                        totalDelay += parseFloat(result.computationalDelay);
                    }
                    if (result.communicationCost !== undefined) {
                        totalcommunicationCost += result.communicationCost;
                    }
                } catch (error) {
                    console.error(`❌ Erreur pour le nœud ${node} :`, error);
                }
            }
        }

        // 🔹 Calcul du délai moyen par nœud
        delays.push(totalDelay / (numNodes * NUM_ROUNDS));
        costs.push(totalcommunicationCost / (numNodes * NUM_ROUNDS));
    }

    // 📊 Générer le graphique
    await generateComputationalDelayChart(nodesConfig, delays);
    
}

// 🔥 Lancer l'analyse
runComputationalDelayAnalysis1();

// teste de plusieur nombre de noeuds en parallèle
async function runComputationalDelayAnalysis() {
    const nodesConfig = [10, 20, 30, 40, 50]; // Différents nombres de nœuds testés
    let delays: number[] = [];

    for (const numNodes of nodesConfig) {
        console.log(`\n🚀 Simulation avec ${numNodes} nœuds...`);

        // 🔹 Création du graphe avec numNodes UAVs
        const graph = new Graph();
        const dids = getStoredDIDs();
        
        for (let i = 0; i < numNodes; i++) {
            graph.addNode(i.toString(), { 
                x: random(0, 100), 
                y: random(0, 100), 
                did: dids[i]
            });
        }

        let totalDelay = 0;

        for (let round = 1; round <= NUM_ROUNDS; round++) {
            console.log(`📡 Round ${round} - Simulation en cours...`);
            
            updatePositions();
            updateConnections();

            // 🚀 Lancer toutes les requêtes en parallèle
            const authenticationPromises = graph.nodes().map(async (node) => {
                const did = graph.getNodeAttribute(node, "did");
                if (!did) return 0;

                try {
                    const result = await evaluateAuthentication(did);
                    return result.computationalDelay ? parseFloat(result.computationalDelay) : 0;
                } catch (error) {
                    console.error(`❌ Erreur pour le nœud ${node} :`, error);
                    return 0;
                }
            });

            // 📌 Attendre que toutes les requêtes soient terminées
            const roundDelays = await Promise.all(authenticationPromises);
            totalDelay += roundDelays.reduce((sum, delay) => sum + delay, 0);
        }

        // 🔹 Calcul du délai moyen par nœud
        delays.push(totalDelay / (numNodes * NUM_ROUNDS));
    }

    // 📊 Générer le graphique
    await generateComputationalDelayChartp(nodesConfig, delays);
}

// 🔥 Lancer l’analyse
runComputationalDelayAnalysis();