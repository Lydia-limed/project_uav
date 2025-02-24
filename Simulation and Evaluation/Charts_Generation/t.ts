
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function generateChart(responseTimes: number[]) {
    if (!responseTimes || responseTimes.length === 0) {
        console.error("❌ Erreur : Aucune donnée fournie pour le graphique !");
        return;
    }

    // ✅ Création des labels "Round 1", "Round 2", ...
    const rounds = responseTimes.map((_, i) => `Round ${i + 1}`);

    // ✅ URL de QuickChart
    const baseUrl = "https://quickchart.io/chart";
    const chartUrl = `${baseUrl}?width=800&height=500&chart=${encodeURIComponent(JSON.stringify({
        type: "line",
        data: {
            labels: rounds,
            datasets: [{
                label: "Time vs Round",
                data: responseTimes,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.3)",
                borderWidth: 2
            }]
        }
    }))}`;

    // ✅ Chemin de sauvegarde
    const saveDir = path.join(process.cwd(), 'Charts');
    const savePath = path.join(saveDir, 'Delay_Vs_round.png');

    try {
        // ✅ Vérifier et créer le dossier si nécessaire
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
            console.log(`📂 Dossier créé : ${saveDir}`);
        }

        // 📥 Téléchargement de l'image
        console.log("📥 Téléchargement de l'image...");
        const response = await axios({ url: chartUrl, responseType: 'stream' });
        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        // ✅ Confirmation
        writer.on('finish', () => console.log(`✅ Image enregistrée sous '${savePath}' !`));
        writer.on('error', (err) => console.error("❌ Erreur lors du téléchargement :", err));

    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'image :", error);
    }



    return {
        images: [
            {
                source: chartUrl, 
                x: 0,
                y: 1,
                sizex: 1,
                sizey: 1,
                xanchor: "left",
                xref: "paper",
                yanchor: "top",
                yref: "paper"
            }
        ],
        xaxis: { visible: false },
        yaxis: { visible: false },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        height: 500,
        width: 800
    };
}




