import { createIdentity } from "./create_did"; 

async function main() {
    try {
        await createIdentity(); 
    } catch (error) {
        console.log("Error:", error);  
    }
}

main();  
