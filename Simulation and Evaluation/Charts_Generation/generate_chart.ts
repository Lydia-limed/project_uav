import QuickChart from 'quickchart-js';
import fs from 'fs';
import axios from 'axios';



    export async function generateCharts_ComputationalDelay_Vs_round(responseTimes: number[]) {
        const rounds = responseTimes.map((_, i) => `Round ${i + 1}`);
    
        // 🔹 Configurer le graphique
        const chart = new QuickChart();
        chart.setConfig({
            type: 'line',
            data: {
                labels: rounds,
                datasets: [
                    {
                        label: 'Average Computational Delay per round',
                        data: responseTimes,
                        borderColor: '#4E79A7',
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    y: { title: { display: true, text: 'Average Computational Delay (ms)' } },
                    x: { title: { display: true, text: 'Rounds' } }
                }
            }
        });

    const imageUrl = chart.getUrl(); // 🔗 URL de l'image

    // 🔹 Télécharger l'image
    const response = await axios({
        url: imageUrl,
        responseType: 'stream',
    });

    const writer = fs.createWriteStream('chart_Computational Delay_vs_rounds.png');
    response.data.pipe(writer);
    writer.on('error', (err) => console.error("❌ Erreur lors du téléchargement :", err));
}






export async function generateComputationalDelayChart(nodes: number[], delays: number[]) {
    // 🔹 Configurer le graphique
    const chart = new QuickChart();
    chart.setConfig({
        type: 'line',
        data: {
            labels: nodes.map(n => `${n}`), // Axe X : Nombre de nœuds
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

    const writer = fs.createWriteStream('chart_computational_delay_char_vs_nodes_seq.png');
    response.data.pipe(writer);
    writer.on('error', (err) => console.error("❌ Erreur lors du téléchargement :", err));
}


export async function generateComputationalDelayChartx(nodes: number[], delays: number[]) {
    // 🔹 Configurer le graphique
    const chart = new QuickChart();
    chart.setWidth(500)
chart.setHeight(300);
chart.setVersion('2');
    chart.setConfig({
        type: 'line',
        data: {
            labels: nodes.map(n => `${n}`), // Axe X : Nombre de nœuds
            datasets: [
                {
                    label: 'Average Computational Delay (ms)',
                    data: delays,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
                    fill: true,
                   // Ajoutez une tension pour une courbe lisse
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { 
                    title: { 
                        display: true, 
                        text: 'Computational Delay (ms)' 
                    },
                   
                },
                x: { 
                    title: { 
                        display: true, 
                        text: 'Number of UAVs' 
                    }
                }
            },
            plugins: {
                legend: {
                    display: true, // Afficher la légende
                    position: 'top'
                }
            }
        }
    });

    const imageUrl = chart.getUrl(); // 🔗 URL de l'image

    // 🔹 Télécharger l'image
    const response = await axios({
        url: imageUrl,
        responseType: 'stream',
    });

    const writer = fs.createWriteStream('chart_computational_delay_char_vs_nodes_seq.png');
    response.data.pipe(writer);
    writer.on('error', (err) => console.error("❌ Erreur lors du téléchargement :", err));
}

export async function generateComputationalDelayChartp(nodes: number[], delays: number[]) {
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

    const writer = fs.createWriteStream('chart_computational_delay_char_vs_nodes_par.png');
    response.data.pipe(writer);

    writer.on('error', (err) => console.error("❌ Erreur lors du téléchargement :", err));
}

