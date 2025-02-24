import { IotaDocument, IotaIdentityClient, IotaDID } from "@iota/identity-wasm/node";
import { AliasOutput, Client, IRent, Utils } from "@iota/sdk-wasm/node";
import { API_ENDPOINT } from "../utils/util";
import { getOrCreateMnemonic } from "../utils/mnemonicManager";
import { sauvegarderDocumentDID, recupererDocumentDID } from "../utils/DidStrorage";

/**
 * Désactive un DID et sauvegarde son document original.
 */
export async function desactiverDid(did1: string) {
    const client = new Client({ primaryNode: API_ENDPOINT, localPow: true });
    const didClient = new IotaIdentityClient(client);
    const secretManager = getOrCreateMnemonic();

    const did = IotaDID.parse(did1);
   
  
    let document = await didClient.resolveDid(did);
    
   
    // 🔹 Sauvegarde du document original avant désactivation
    sauvegarderDocumentDID(did1, document);

    let deactivatedOutput: AliasOutput = await didClient.deactivateDidOutput(did);
    const rentStructure: IRent = await didClient.getRentStructure();
    deactivatedOutput = await client.buildAliasOutput({
        ...deactivatedOutput,
        amount: Utils.computeStorageDeposit(deactivatedOutput, rentStructure),
        aliasId: deactivatedOutput.getAliasId(),
        unlockConditions: deactivatedOutput.getUnlockConditions(),
    });

    await didClient.publishDidOutput(secretManager, deactivatedOutput);
    console.log(`✅ DID désactivé avec succès.`);
}