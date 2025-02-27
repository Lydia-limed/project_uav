import fs from 'fs';
import path from 'path';
import axios from 'axios';

const QUICKCHART_BASE_URL = "https://quickchart.io/chart/render/zm-7317b21f-5fcd-4054-9c67-2e9e6928bcab";

export async function generateChart(nodes: number[], delays: number[]) {
    if (!nodes || nodes.length === 0 || !delays || delays.length === 0) {
        console.error("❌ Error: No data provided for the chart!");
        return null;
    }

    // ✅ Generate the chart URL
    const labels = nodes.join(",");
    const data = delays.join(",");
    const chartUrl = `${QUICKCHART_BASE_URL}?labels=${labels}&data1=${data}`;

    // ✅ Define the save path
    const saveDir = path.join(process.cwd(), 'Charts');
    const savePath = path.join(saveDir, 'Delay_Vs_nodes_sequence.png');

    let layout = null;

    try {
        // ✅ Ensure the directory exists
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
            console.log(`📂 Directory created: ${saveDir}`);
        }

        // ✅ Download the chart image
     
        const response = await axios({ url: chartUrl, responseType: 'stream' });

        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        // ✅ Ensure the image is fully saved before continuing
        await new Promise<void>((resolve, reject) => {
            writer.on('finish', () => resolve()); // ✅ Now correctly typed
            writer.on('error', (err) => reject(err));
        });

        console.log(`✅ Chart successfully saved as '${savePath}'!`);

        // ✅ Assign layout only after the image is successfully saved
        layout = {
            images: [{
                source: chartUrl,
                x: 0,
                y: 1,
                sizex: 1,
                sizey: 1,
                xanchor: "left",
                xref: "paper",
                yanchor: "top",
                yref: "paper"
            }],
            xaxis: { visible: false },
            yaxis: { visible: false },
            margin: { l: 0, r: 0, t: 0, b: 0 },
            height: 500,
            width: 800
        };

    } catch (error) {
        console.error("❌ Error retrieving or saving the image:", error);
        return null;
    }

    return layout;
}
