import Graph from 'graphology';
import * as fs from 'fs';
import * as path from 'path';
const random = require('lodash.random');
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
// afficher le graphe de teps vs round t le graphe de num de node sequenciel vs temps
async function runMobileSimulation(numNodes: number) {  
    const NUM_ROUNDS = 10;
    let responseTimes: number[] = [];



    for (let round = 1; round <= NUM_ROUNDS; round++) {
        
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
     
    if (numNodes === 50) {
    // ✅ Calcul de la moyenne des temps de réponse
    const avgComputationalDelay = responseTimes.reduce((sum, time) => sum + time, 0) / NUM_ROUNDS;
    console.log(`\n📊 Temps de réponse moyen après ${NUM_ROUNDS} rounds pour ${numNodes} UAVs : ${avgComputationalDelay.toFixed(0)} ms`);
     // ✅ Générer le graphique Temps vs Round pour ce test
     generateCharts_ComputationalDelay_Vs_round(responseTimes);
     console.log(responseTimes)
  
}

   


}

async function testMultipleNodeConfigs() {
    const nodesConfig = [10, 20, 30, 40, 50];  // Différents nombres de nœuds à tester


    for (const numNodes of nodesConfig) {
         await runMobileSimulation(numNodes);
       
    }
}

testMultipleNodeConfigs();