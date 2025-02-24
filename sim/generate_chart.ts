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



// export async function g(nodes: number[], delays: number[]) {

// const chart = new QuickChart();

// chart.setWidth(650)
// chart.setHeight(400);
// chart.setVersion('2');

// chart.setConfig({
//   "type": "line",
//   "data": {
//     "datasets": [
//       {
//         "fill": true,
//         "spanGaps": false,
//         "lineTension": 0,
//         "pointRadius": 3,
//         "pointHoverRadius": 3,
//         "pointStyle": "circle",
//         "borderDash": [
//           0,
//           0
//         ],
//         "barPercentage": 0.9,
//         "categoryPercentage": 0.8,
//         "data": [
//           8.776,
//           7.6225,
//           7.219999999999999,
//           7.335000000000001,
//           7.05
//         ],
//         "type": "line",
//         "label": "",
//         "borderColor": "#59A14F",
//         "backgroundColor": "rgba(89, 161, 79, 0.25)",
//         "borderWidth": 3,
//         "hidden": false
//       }
//     ],
//     "labels": [
//       "50",
//       "40",
//       "30",
//       "20",
//       "10"
//     ]
//   },
//   "options": {
//     "title": {
//       "display": false,
//       "position": "top",
//       "fontSize": 12,
//       "fontFamily": "sans-serif",
//       "fontColor": "#666666",
//       "fontStyle": "bold",
//       "padding": 10,
//       "lineHeight": 1.2,
//       "text": "Chart title"
//     },
//     "layout": {
//       "padding": {},
//       "left": 0,
//       "right": 0,
//       "top": 0,
//       "bottom": 0
//     },
//     "legend": {
//       "display": false,
//       "position": "top",
//       "align": "center",
//       "fullWidth": true,
//       "reverse": false,
//       "labels": {
//         "fontSize": 12,
//         "fontFamily": "sans-serif",
//         "fontColor": "#666666",
//         "fontStyle": "normal",
//         "padding": 10
//       }
//     },
//     "scales": {
//       "xAxes": [
//         {
//           "id": "X1",
//           "display": true,
//           "position": "bottom",
//           "type": "category",
//           "stacked": false,
//           "offset": false,
//           "time": {
//             "unit": false,
//             "stepSize": 1,
//             "displayFormats": {
//               "millisecond": "h:mm:ss.SSS a",
//               "second": "h:mm:ss a",
//               "minute": "h:mm a",
//               "hour": "hA",
//               "day": "MMM D",
//               "week": "ll",
//               "month": "MMM YYYY",
//               "quarter": "[Q]Q - YYYY",
//               "year": "YYYY"
//             }
//           },
//           "distribution": "linear",
//           "gridLines": {
//             "display": true,
//             "color": "rgba(0, 0, 0, 0.1)",
//             "borderDash": [
//               0,
//               0
//             ],
//             "lineWidth": 1,
//             "drawBorder": true,
//             "drawOnChartArea": true,
//             "drawTicks": true,
//             "tickMarkLength": 10,
//             "zeroLineWidth": 1,
//             "zeroLineColor": "rgba(0, 0, 0, 0.25)",
//             "zeroLineBorderDash": [
//               0,
//               0
//             ]
//           },
//           "angleLines": {
//             "display": true,
//             "color": "rgba(0, 0, 0, 0.1)",
//             "borderDash": [
//               0,
//               0
//             ],
//             "lineWidth": 1
//           },
//           "pointLabels": {
//             "display": true,
//             "fontColor": "#666",
//             "fontSize": 10,
//             "fontStyle": "normal"
//           },
//           "ticks": {
//             "display": true,
//             "fontSize": 18,
//             "fontFamily": "sans-serif",
//             "fontColor": "#000000",
//             "fontStyle": "normal",
//             "padding": 0,
//             "stepSize": null,
//             "minRotation": 0,
//             "maxRotation": 50,
//             "mirror": false,
//             "reverse": false
//           },
//           "scaleLabel": {
//             "display": true,
//             "labelString": "Number of UAVs",
//             "lineHeight": 1.2,
//             "fontColor": "#000000",
//             "fontFamily": "sans-serif",
//             "fontSize": 18,
//             "fontStyle": "normal",
//             "padding": 4
//           }
//         }
//       ],
//       "yAxes": [
//         {
//           "id": "Y1",
//           "display": true,
//           "position": "left",
//           "type": "linear",
//           "stacked": false,
//           "offset": false,
//           "time": {
//             "unit": false,
//             "stepSize": 1,
//             "displayFormats": {
//               "millisecond": "h:mm:ss.SSS a",
//               "second": "h:mm:ss a",
//               "minute": "h:mm a",
//               "hour": "hA",
//               "day": "MMM D",
//               "week": "ll",
//               "month": "MMM YYYY",
//               "quarter": "[Q]Q - YYYY",
//               "year": "YYYY"
//             }
//           },
//           "distribution": "linear",
//           "gridLines": {
//             "display": true,
//             "color": "rgba(0, 0, 0, 0.1)",
//             "borderDash": [
//               0,
//               0
//             ],
//             "lineWidth": 1,
//             "drawBorder": true,
//             "drawOnChartArea": true,
//             "drawTicks": true,
//             "tickMarkLength": 10,
//             "zeroLineWidth": 1,
//             "zeroLineColor": "rgba(0, 0, 0, 0.25)",
//             "zeroLineBorderDash": [
//               0,
//               0
//             ]
//           },
//           "angleLines": {
//             "display": true,
//             "color": "rgba(0, 0, 0, 0.1)",
//             "borderDash": [
//               0,
//               0
//             ],
//             "lineWidth": 1
//           },
//           "pointLabels": {
//             "display": true,
//             "fontColor": "#666",
//             "fontSize": 10,
//             "fontStyle": "normal"
//           },
//           "ticks": {
//             "display": true,
//             "fontSize": 18,
//             "fontFamily": "sans-serif",
//             "fontColor": "#000000",
//             "fontStyle": "normal",
//             "padding": 0,
//             "stepSize": null,
//             "minRotation": 0,
//             "maxRotation": 50,
//             "mirror": false,
//             "reverse": false
//           },
//           "scaleLabel": {
//             "display": true,
//             "labelString": "Average Computational Delay (ms) ",
//             "lineHeight": 1.2,
//             "fontColor": "#000000",
//             "fontFamily": "sans-serif",
//             "fontSize": 18,
//             "fontStyle": "normal",
//             "padding": 4
//           }
//         }
//       ]
//     },
//     "plugins": {
//       "datalabels": {
//         "display": false,
//         "align": "center",
//         "anchor": "center",
//         "backgroundColor": "#eee",
//         "borderColor": "#ddd",
//         "borderRadius": 6,
//         "borderWidth": 1,
//         "padding": 4,
//         "color": "#666666",
//         "font": {
//           "family": "sans-serif",
//           "size": 10,
//           "style": "normal"
//         }
//       },
//       "datalabelsZAxis": {
//         "enabled": false
//       },
//       "googleSheets": {},
//       "airtable": {},
//       "tickFormat": ""
//     },
//     "cutoutPercentage": 50,
//     "rotation": -1.5707963267948966,
//     "circumference": 6.283185307179586,
//     "startAngle": -1.5707963267948966
//   }
// });

// // Print the chart URL
// console.log(chart.getUrl());

// // Get the image...
// const image = await chart.toBinary();

// // Or write it to a file
// chart.toFile('chart.png')
// }



export async function g(nodes: number[], delays: number[]) {
    const chart = new QuickChart();

    chart.setWidth(650);
    chart.setHeight(400);
    chart.setVersion('2'); // Assurer la bonne version

    // Remplace les valeurs statiques par les paramètres `nodes` et `delays`
    chart.setConfig({
        type: "line",
        data: {
            datasets: [
                {
                    label: "Average Computational Delay",
                    data: delays,  // 📊 Dynamique
                    borderColor: "#59A14F",
                    backgroundColor: "rgba(89, 161, 79, 0.25)",
                    borderWidth: 3,
                    fill: true,
                    pointRadius: 3
                }
            ],
            labels: nodes.map(String) // 📌 Convertir en chaînes de caractères
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Number of UAVs"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Average Computational Delay (ms)"
                    }
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });

    // 📌 Afficher l'URL du graphique
    console.log("Chart URL:", chart.getUrl());

    // 📌 Générer l'image et l'enregistrer
    await chart.toFile('chart.png');
}
