import QuickChart from 'quickchart-js';


export function generateChart(activatedData: number[], deactivatedData: number[], nonAuthenticatedData: number[], NUM_ROUNDS: number) {
    const chart = new QuickChart();

    chart.setConfig({
        type: 'line',
        data: {
            labels: Array.from({ length: NUM_ROUNDS }, (_, i) => `Round ${i + 1}`), // Labels pour chaque round
            datasets: [
                {
                    label: 'DIDs Activés',
                    data: activatedData,
                    borderColor: 'rgba(0, 255, 0, 1)', // Vert pour activés
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'DIDs Désactivés',
                    data: deactivatedData,
                    borderColor: 'rgba(255, 0, 0, 1)', // Rouge pour désactivés
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'DIDs Non Authentifiés',
                    data: nonAuthenticatedData,
                    borderColor: 'rgba(255, 255, 0, 1)', // Jaune pour non authentifiés
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Rounds'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temps de Réponse (ms)'
                    }
                }
            }
        }
    });

    // Générer l'image du graphique
    chart.toFile('Delay_Vs_Class.png').then(() => {
        console.log('📊 Le graphique a été généré et enregistré sous "computational_delay_chart.png".');
    }).catch((error) => {
        console.error('❌ Erreur lors de la génération du graphique:', error);
    });
}
