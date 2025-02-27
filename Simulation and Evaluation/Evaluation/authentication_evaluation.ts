// import { AuthenticateDID } from "../../Functions/Authentication/resolveDid";
// import { performance } from "perf_hooks";

// /**
//  * Accurately evaluates the performance of DID authentication.
//  * @param did - The DID identifier to authenticate.
//  * @returns An object containing Computational Delay, Communication Cost, and the final Status.
//  */
// export async function evaluateAuthentication(did: string) {
//     const numTrials = 5; // 🔄 Repeat multiple times to smooth out variations
//     let totalDelay = 0;
//     let totalCommCost = 0;
//     let finalStatus = null; // 📌 Initialize with `null`

//     // 🚀 Warm-up: Perform a test request before the first trial
//     await AuthenticateDID(did);
//     // await new Promise(resolve => setTimeout(resolve, 50)); // Pause to stabilize

//     for (let i = 0; i < numTrials; i++) {
//         const startTime = performance.now();
//         const result = await AuthenticateDID(did);
//         const endTime = performance.now();

//         totalDelay += endTime - startTime;

//         // Communication cost (size of transmitted data)
//         const requestSize = Buffer.byteLength(did, "utf8");
//         const responseSize = Buffer.byteLength(JSON.stringify(result), "utf8");
//         totalCommCost += requestSize + responseSize;

//         if (result.hasOwnProperty("status")) {
//             finalStatus = result.status;
//         }

//         // 📌 Add a random delay to prevent performance spikes
//         // await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
//     }

//     return {
//         computationalDelay: (totalDelay / numTrials).toFixed(2), // Average delay
//         communicationCost: totalCommCost,
//         status: finalStatus
//     };
// }
import { AuthenticateDID } from "../../Functions/Authentication/resolveDid";
import { performance } from "perf_hooks";

/**
 * Accurately evaluates the performance of DID authentication.
 * @param did - The DID identifier to authenticate.
 * @returns An object containing Computational Delay, Communication Cost, and the final Status.
 */
export async function evaluateAuthentication(did: string) {
    const numTrials = 5; // 🔄 Repeat multiple times to smooth out variations
    let totalDelay = 0;
    let totalCommCost = 0;
    let finalStatus = null; // 📌 Initialize with `null`

    await AuthenticateDID(did);


    for (let i = 0; i < numTrials; i++) {
        const startTime = performance.now();
        const result = await AuthenticateDID(did);
        const endTime = performance.now();

        totalDelay += endTime - startTime;

        // Communication cost (size of transmitted data)
        const requestSize = Buffer.byteLength(did, "utf8");
        const responseSize = Buffer.byteLength(JSON.stringify(result), "utf8");
        totalCommCost += requestSize + responseSize;

        if (result.hasOwnProperty("status")) {
            finalStatus = result.status;
        }

    }

    return {
        computationalDelay: (totalDelay / numTrials).toFixed(2), // Average delay
        communicationCost: totalCommCost,
        status: finalStatus
    };
}
