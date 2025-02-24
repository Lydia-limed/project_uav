import QuickChart from 'quickchart-js';
import fs from 'fs';
import axios from 'axios';



    export async function generateChart(responseTimes: number[]) {
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

    const writer = fs.createWriteStream('Delay_Vs_round.png');
    response.data.pipe(writer);
    writer.on('error', (err) => console.error("❌ Erreur lors du téléchargement :", err));
}


