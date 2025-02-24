import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
const random = require('lodash.random');
import { evaluateAuthentication } from './authentication_evaluation';
import { generateComputationalDelayChart } from "./generate_chart";

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

// Création du graphe UAV
const graph = new Graph();
for (let i = 0; i < NUM_NODES; i++) {
    graph.addNode(i.toString(), { 
        x: random(0, 100), 
        y: random(0, 100), 
        did: dids[i] 
    });
}

// Mise à jour des positions des UAVs
function updatePositions() {
    graph.forEachNode((node, attributes) => {
        graph.mergeNodeAttributes(node, {
            x: attributes.x + random(-10, 10), 
            y: attributes.y + random(-10, 10)  
        });
    });
}

// Mise à jour des connexions
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

// Fonction principale exécutant la simulation avec `numNodes` UAVs en parallèle
async function runMobileSimulation(numNodes: number) {  
    const NUM_ROUNDS = 10;
    let responseTimes: number[] = [];

    for (let round = 1; round <= NUM_ROUNDS; round++) {
        updatePositions();
        updateConnections();

        const authPromises = graph.nodes().slice(0, numNodes).map(async (node) => {
            const did = graph.getNodeAttribute(node, "did");
            if (!did) {
                console.error(`❌ Aucun DID attribué au nœud ${node} !`);
                return 0; 
            }

            try {
                const result = await evaluateAuthentication(did);
                return result.computationalDelay ? parseFloat(result.computationalDelay) : 0;
            } catch (error) {
                console.error(`❌ Erreur lors de l'authentification du nœud ${node}:`, error);
                return 0;
            }
        });

        // Lancer toutes les requêtes en parallèle
        const roundResults = await Promise.all(authPromises);

        // Calculer la moyenne des temps de réponse pour ce round
        const avgRoundTime = roundResults.reduce((sum, time) => sum + time, 0) / numNodes;
        responseTimes.push(avgRoundTime);
    }

    // Calcul final de la moyenne des temps de réponse
    const avgComputationalDelay = responseTimes.reduce((sum, time) => sum + time, 0) / NUM_ROUNDS;
    console.log(`\n📊 Temps de réponse moyen pour ${numNodes} UAVs : ${avgComputationalDelay.toFixed(0)} ms`);

    return avgComputationalDelay;
}

// Exécuter la simulation pour différentes tailles de réseau
async function testMultipleNodeConfigs() {
    const nodesConfig = [10, 20, 30, 40, 50];  
    const delays = await Promise.all(nodesConfig.map(runMobileSimulation));

    console.log("📊 Délais moyens :", delays);
    console.log("📊 Configurations des UAVs :", nodesConfig);

    // Générer le graphique Temps vs Nombre de nœuds
    generateComputationalDelayChart(nodesConfig, delays);
}

// Lancer la simulation mobile avec différentes tailles de réseau
testMultipleNodeConfigs();
