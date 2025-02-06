
    
    import { reactiverDid } from "./activateIdentity";
    import { supprimerDocumentDID } from "../utils/DidStrorage";
    
    
    


        async function main() {
            const did = "did:iota:snd:0xc3b2df78bf9b0b5c8fa79ed9d5166ad20aadbcdc3b2222089680ee3303f33f57";
            try {
                // Réactiver le DID
                const Did = await reactiverDid(did);
                if (Did) {
                // Supprimer le document une fois le DID réactivé
                const deleted = supprimerDocumentDID(Did);
                if (deleted) {
                    console.log(`✅ Document associé au DID ${did} supprimé.`);
                } else {
                    console.error(`❌ Échec de la suppression du document pour le DID ${did}.`);
                }

            } else {
                console.error("❌ Le DID n'a pas été réactivé.");
            }
            } catch (error) {
                console.error("❌ Erreur lors de la réactivation ou de la suppression du DID : ", error);
            }
        }
        
        // Exemple d'appel
        main();