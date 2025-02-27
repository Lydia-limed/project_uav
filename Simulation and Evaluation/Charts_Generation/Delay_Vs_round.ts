import fs from 'fs';
import path from 'path';
import axios from 'axios';


const QUICKCHART_BASE_URL = "https://quickchart.io/chart/render/zm-dd0155ef-5daf-4b22-bf8d-29a3245ce67c";

export async function generateChart(responseTimes: number[]) {
    if (!responseTimes || responseTimes.length === 0) {
        console.error("❌ Error: No data provided for the chart!");
        return;
    }

    // ✅ Creating labels "Round 1", "Round 2", ...
    const rounds = responseTimes.map((_, i) => `Round ${i + 1}`);
    const data = responseTimes.join(",");
    // ✅ QuickChart URL
    const chartUrl = `${QUICKCHART_BASE_URL}?labels=${rounds}&data1=${data}`;


    // ✅ Save path
    const saveDir = path.join(process.cwd(), 'Charts');
    const savePath = path.join(saveDir, 'Delay_Vs_round.png');

    try {
        // ✅ Check and create directory if necessary
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
            console.log(`📂 Directory created: ${saveDir}`);
        }

        // 📥 Downloading the image
        const response = await axios({ url: chartUrl, responseType: 'stream' });
        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        // ✅ Confirmation
        writer.on('finish', () => console.log(`✅ Image saved as '${savePath}'!`));
        writer.on('error', (err) => console.error("❌ Error while downloading:", err));

    } catch (error) {
        console.error("❌ Error retrieving the image:", error);
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
