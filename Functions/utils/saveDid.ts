import * as fs from "fs";
import * as path from "path";
import { IotaDID} from "@iota/identity-wasm/node";
// Définition du chemin du fichier DID
const DID_FILE = path.join(__dirname, "..", "dids.json");

export function saveDID(did: IotaDID) {
    let dids: string[] = [];
    
    // Vérifier si le fichier existe et charger les DIDs précédents
    if (fs.existsSync(DID_FILE)) {
        const data = fs.readFileSync(DID_FILE, "utf8");
        dids = JSON.parse(data);
    }

    // Ajouter le nouveau DID
    dids.push(did.toString());

    // Sauvegarder dans le fichier
    fs.writeFileSync(DID_FILE, JSON.stringify(dids, null, 2));
    console.log("✅ DID sauvegardé dans dids.json !");
}