import fs from 'fs';
import path from 'path';
import axios from 'axios';

// 📌 QuickChart API base URL
const CHART_API_URL = "https://quickchart.io/chart/render/zm-7d21ea76-3a41-4eef-b4ea-1da68b468b73";

// 📌 Directory where the chart image will be saved
const SAVE_DIR = path.join(process.cwd(), 'Charts');
const SAVE_PATH = path.join(SAVE_DIR, 'Delay_Vs_class.png');

/**
 * Generates and saves a computational delay chart using QuickChart API.
 * @param activatedData - Response times for activated DIDs
 * @param deactivatedData - Response times for deactivated DIDs
 * @param nonAuthenticatedData - Response times for non-authenticated DIDs
 * @param NUM_ROUNDS - Number of rounds in the simulation
 * @returns A layout object with the chart URL or null in case of error
 */
export async function generateChart(
    activatedData: number[],
    deactivatedData: number[],
    nonAuthenticatedData: number[],
    NUM_ROUNDS: number
){
    
    try {
        // 📌 Ensure the Charts directory exists
        if (!fs.existsSync(SAVE_DIR)) {
            fs.mkdirSync(SAVE_DIR, { recursive: true });
            console.log(`📂 Directory created: ${SAVE_DIR}`);
        }

        // 📌 Generate labels for rounds (Round 1, Round 2, ...)
        const labels = Array.from({ length: NUM_ROUNDS }, (_, i) => `Round ${i + 1}`).join(',');

        // 📌 Convert datasets to URL format
        const data1 = activatedData.join(',');
        const data2 = deactivatedData.join(',');
        const data3 = nonAuthenticatedData.join(',');

        // 📌 Construct full API URL with parameters
        const chartUrl = `${CHART_API_URL}?labels=${labels}&data1=${data1}&data2=${data2}&data3=${data3}`;

        // 📌 Download and save the chart image
        const response = await axios({ url: chartUrl, responseType: 'stream' });
        const writer = fs.createWriteStream(SAVE_PATH);
        response.data.pipe(writer);

        // ✅ Wait for the image to be fully saved
        await new Promise<void>((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`✅ Chart successfully saved as '${SAVE_PATH}'!`);

        // ✅ Define layout template for rendering
        return {
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
        console.error("❌ Error generating or saving the chart:", error);
        return null;
    }
}
