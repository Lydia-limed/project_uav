import { IotaDocument } from "@iota/identity-wasm/node";
import fs from 'fs'; // Ensure you import the fs module

// Define the file path where the DID documents will be stored
const FILE_PATH = '../utils/documentsDID.json';

// Define the type of the data object
interface DocumentData {
    [did: string]: any; // 'did' is the key, and 'any' represents the IotaDocument JSON
}

export function sauvegarderDocumentDID(did: string, document: IotaDocument) {
    // Convert the IotaDocument to JSON
    let jsonRepresentation = document.toJSON();

    // Read existing data from the file if it exists, otherwise initialize an empty object
    let data: DocumentData = {}; // Initialize `data` with the appropriate type
    if (fs.existsSync(FILE_PATH)) {
        const existingData = fs.readFileSync(FILE_PATH, 'utf-8');
        data = JSON.parse(existingData);
    }

    // Store the JSON representation of the document with the DID as the key
    data[did] = jsonRepresentation;

    // Log the saved data for debugging
    // console.log("📌 JSON Sauvegardé :", JSON.stringify(data, null, 2));

    // Write the updated data to the file
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

/**
 * Récupère un document DID et le reconstruit en `IotaDocument`.
 */
export function recupererDocumentDID(did: string): IotaDocument | null {
    if (!fs.existsSync(FILE_PATH)) {
        console.error("❌ Fichier de stockage introuvable !");
        return null;
    }

    const fileContent = fs.readFileSync(FILE_PATH, "utf8").trim();
    if (!fileContent) {
        console.error("❌ Fichier de stockage vide !");
        return null;
    }

    const data: DocumentData = JSON.parse(fileContent);
    if (!data[did]) {
        console.error(`❌ DID ${did} introuvable dans le stockage !`);
        return null;
    }

    // console.log("📌 JSON Récupéré :", JSON.stringify(data[did], null, 2)); // Debug

    // Reformater les données pour inclure le champ `doc`
    const docData = {
        doc: data[did], // Ajouter `doc` autour des données du DID
        meta: {
            created: new Date().toISOString(), // Optionnel : vous pouvez ajuster les valeurs `created` et `updated`
            updated: new Date().toISOString()
        }
    };

    // ✅ Convertir `doc` en instance de `IotaDocument`
    return IotaDocument.fromJSON(docData);
}

export function supprimerDocumentDID(did: string): boolean {
    if (!fs.existsSync(FILE_PATH)) {
        console.error("❌ Fichier de stockage introuvable !");
        return false;
    }

    const fileContent = fs.readFileSync(FILE_PATH, "utf8").trim();
    if (!fileContent) {
        console.error("❌ Fichier de stockage vide !");
        return false;
    }

    const data: DocumentData = JSON.parse(fileContent);
    if (!data[did]) {
        console.error(`❌ DID ${did} introuvable dans le stockage !`);
        return false;
    }

    // Supprimer le document associé au DID
    delete data[did];

    // Réécrire le fichier après la suppression du document
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

    console.log(`✅ Document avec DID ${did} supprimé avec succès !`);
    return true;
}
