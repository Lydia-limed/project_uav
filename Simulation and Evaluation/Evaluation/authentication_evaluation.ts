// import { AuthenticateDID } from "../../Functions/Authentication/resolveDid";
// import { performance } from "perf_hooks";

// /**
//  * Évalue précisément les performances de l'authentification DID.
//  * @param did - L'identifiant DID à authentifier.
//  * @returns Un objet contenant le Computational Delay, le Communication Cost et le Status final.
//  */
// export async function evaluateAuthentication(did: string) {
//     const numTrials = 10; // 🔄 Répéter plusieurs fois pour lisser les variations
//     let totalDelay = 0;
//     let totalCommCost = 0;
//     let finalStatus = null; // 📌 Initialiser avec `null`

//     for (let i = 0; i < numTrials; i++) {
//         // 📌 Mesurer le temps avant l'authentification
//         const startTime = performance.now();

//         // 📌 Exécuter l'authentification et récupérer la réponse
//         const result = await AuthenticateDID(did);

//         // 📌 Mesurer le temps après l'authentification
//         const endTime = performance.now();
//         totalDelay += endTime - startTime;

//         // 📌 Coût de communication (taille exacte des données transmises)
//         const requestSize = Buffer.byteLength(did, "utf8");
//         const responseSize = Buffer.byteLength(JSON.stringify(result), "utf8");
//         totalCommCost += requestSize + responseSize;

//         // 📌 Stocker le dernier statut, même si c'est `0`
//         if (result.hasOwnProperty("status")) {
//             finalStatus = result.status;
//         }

//         // 📌 Attendre un peu pour stabiliser les mesures (évite les pics)
//         await new Promise(resolve => setTimeout(resolve, 10));
//     }

//     // 📊 Moyenne des résultats
//     const avgComputationalDelay = (totalDelay / numTrials).toFixed(2);
//     const avgCommunicationCost = Math.round(totalCommCost / numTrials);

//     return {
//         computationalDelay: avgComputationalDelay,
//         communicationCost: avgCommunicationCost,
//         status: finalStatus // 📌 Retourner le statut final
//     };
// }



import { AuthenticateDID } from "../../Functions/Authentication/resolveDid";
import { performance } from "perf_hooks";

/**
 * Évalue précisément les performances de l'authentification DID.
 * @param did - L'identifiant DID à authentifier.
 * @returns Un objet contenant le Computational Delay, le Communication Cost et le Status final.
 */
export async function evaluateAuthentication(did: string) {
    const numTrials = 15; // 🔄 Répéter plusieurs fois pour lisser les variations
    let totalDelay = 0;
    let totalCommCost = 0;
    let finalStatus = null; // 📌 Initialiser avec `null`

    // 🚀 Échauffement : Exécuter une requête de test avant le premier essai

    await AuthenticateDID(did);
    await new Promise(resolve => setTimeout(resolve, 50)); // Pause pour stabiliser

    for (let i = 0; i < numTrials; i++) {
        const startTime = performance.now();
        const result = await AuthenticateDID(did);
        const endTime = performance.now();

        totalDelay += endTime - startTime;

        // Coût de communication (taille des données transmises)
        const requestSize = Buffer.byteLength(did, "utf8");
        const responseSize = Buffer.byteLength(JSON.stringify(result), "utf8");
        totalCommCost += requestSize + responseSize;

        if (result.hasOwnProperty("status")) {
            finalStatus = result.status;
        }

        // 📌 Ajout d’un délai aléatoire pour éviter des pics de performance
        await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
    }

    return {
        computationalDelay: (totalDelay / numTrials).toFixed(2), // Moyenne des délais
        communicationCost: totalCommCost,
        status: finalStatus
    };
}
