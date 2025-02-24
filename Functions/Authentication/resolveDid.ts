// Copyright 2020-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {
    IotaDocument,
    IotaIdentityClient,
    IotaDID
} from "@iota/identity-wasm/node";
import { Client } from "@iota/sdk-wasm/node";
import { getOrCreateMnemonic } from "../utils/mnemonicManager";

// Configuration pour IOTA Sandbox en local
const API_ENDPOINT = "http://localhost"; // Endpoint du nœud Hornet local

/**
 * Vérifie si une DID est enregistrée dans le Tangle.
 * @param did La DID à vérifier (au format string ou IotaDID).
 * @returns true si la DID est trouvée dans le Tangle, sinon false.
 */
export async function AuthenticateDID(did: string): Promise<{ authenticated: boolean, status: number }> {
    const iotaDID = IotaDID.parse(did);

    const client = new Client({
        primaryNode: API_ENDPOINT,
        localPow: true,
    });
    const didClient = new IotaIdentityClient(client);

    try {
        // Resolve the latest state of the DID document.
        let document: IotaDocument = await didClient.resolveDid(iotaDID);
        // console.log("Document trouvé :", JSON.stringify(document, null, 2));

        // Vérifier si le DID est déjà désactivé
        if (document.metadataDeactivated()) {
            // console.log("❌ Le DID est désactivé.");
            return { authenticated: false, status: 0 }; // 0 = Désactivé
        } else {
            // console.log("✅ Le DID est activé.");
            return { authenticated: true, status: 1 }; // DID activé
        }
    } catch (err) {
        // console.error("Erreur lors de la vérification de la DID :", err);
        return { authenticated: false, status: -1 }; // Erreur de résolution
    }
}

// // Exemple d'utilisation
// const did = "did:iota:snd:0x681453155007fc1a9902bbedc4981bdde8d58671e676a5a5315f32c2fb8870f2"; // Remplacez par un DID valide
// AuthenticateDID(did).then(result => {
//     console.log("Résultat de la vérification :", result);
// });