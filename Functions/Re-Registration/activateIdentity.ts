import { IotaDocument, IotaIdentityClient, IotaDID } from "@iota/identity-wasm/node";
import { AliasOutput, Client, IRent, Utils } from "@iota/sdk-wasm/node";
import { API_ENDPOINT } from "../utils/util";
import { getOrCreateMnemonic } from "../utils/mnemonicManager";
import { sauvegarderDocumentDID, recupererDocumentDID } from "../utils/DidStrorage";
export async function reactiverDid(did1: string) {
    const client = new Client({ primaryNode: API_ENDPOINT, localPow: true });
    const didClient = new IotaIdentityClient(client);
    const secretManager = getOrCreateMnemonic();

    const did = IotaDID.parse(did1);

    let doc = await didClient.resolveDid(did);
    if (!doc.metadataDeactivated()) {
        console.log("⚠️ DID déjà actif, réactivation inutile.");
        return;
    }

    // 🔹 Charger le document original depuis le stockage
    const originalDocument = recupererDocumentDID(did1);

 
    if (!originalDocument) {
        console.error("❌ Aucun document original sauvegardé, impossible de réactiver !");
        throw new Error("Le document original n'a pas été trouvé.");
    }

    let reactivatedOutput: AliasOutput = await didClient.updateDidOutput(originalDocument);
    const rentStructure: IRent = await didClient.getRentStructure();
    reactivatedOutput = await client.buildAliasOutput({
        ...reactivatedOutput,
        amount: Utils.computeStorageDeposit(reactivatedOutput, rentStructure),
        aliasId: reactivatedOutput.getAliasId(),
        unlockConditions: reactivatedOutput.getUnlockConditions(),
    });

    await didClient.publishDidOutput(secretManager, reactivatedOutput);
    console.log(`✅ DID  réactivé avec succès.`);
    return did1
}