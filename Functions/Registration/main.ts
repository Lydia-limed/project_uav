import { createIdentity } from "./create_did"; 

async function main() {
    try {
        for (let i = 0; i < 50; i++) {
        await createIdentity(); }
    } catch (error) {
        console.log("Error:", error);  
    }
}

main();  
