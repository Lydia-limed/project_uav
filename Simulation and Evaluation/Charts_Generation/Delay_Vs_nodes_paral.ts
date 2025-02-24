import QuickChart from 'quickchart-js';
import fs from 'fs';
import axios from 'axios';


export async function generateChart(nodes: number[], delays: number[]) {
    // 🔹 Configurer le graphique
    const chart = new QuickChart();
    chart.setConfig({
        type: 'line',
        data: {
            labels: nodes.map(n => `${n} Nodes`), // Axe X : Nombre de nœuds
            datasets: [
                {
                    label: 'Average Computational Delay (ms)',
                    data: delays,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
                    fill: true
                }
            ]
        },
        options: {
            scales: {
                y: { title: { display: true, text: 'Computational Delay (ms)' } },
                x: { title: { display: true, text: 'Number of Nodes (UAVs)' } }
            }
        }
    });

    const imageUrl = chart.getUrl(); // 🔗 URL de l'image

    // 🔹 Télécharger l'image
    const response = await axios({
        url: imageUrl,
        responseType: 'stream',
    });

    const writer = fs.createWriteStream('Delay_Vs_nodes_paral.png');
    response.data.pipe(writer);

    writer.on('error', (err) => console.error("❌ Erreur lors du téléchargement :", err));
}

