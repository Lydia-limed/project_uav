
import { desactiverDid } from "./deactivateIdentity";





  const did = "did:iota:snd:0xc3b2df78bf9b0b5c8fa79ed9d5166ad20aadbcdc3b2222089680ee3303f33f57";

    try {
        desactiverDid(did);
        
    } catch (error) {
        console.error("❌ Erreur:", error);
    }
