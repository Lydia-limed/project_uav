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
    let finalStatus = null; 

    await AuthenticateDID(did);


    for (let i = 0; i < numTrials; i++) {
        const startTime = performance.now();
        const result = await AuthenticateDID(did);
        const endTime = performance.now();

        totalDelay += endTime - startTime;

        // Communication cost (size of transmitted data)
        const requestSize = Buffer.byteLength(did, "utf8");
        console.log("Request size: ", requestSize);
        const responseSize = Buffer.byteLength(JSON.stringify(result), "utf8");
        console.log("Response size: ", responseSize);
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
