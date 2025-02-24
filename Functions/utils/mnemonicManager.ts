import * as fs from "fs";
import { Utils, MnemonicSecretManager } from "@iota/sdk-wasm/node";

import * as path from "path";

const MNEMONIC_FILE = path.join(__dirname, "..", "mnemonic.json");


/**
 * Récupère le mnemonic depuis le fichier ou le génère si absent.
 */
export function getOrCreateMnemonic(): MnemonicSecretManager {
    if (fs.existsSync(MNEMONIC_FILE)) {
        console.log("📂 Chargement du mnemonic depuis mnemonic.json...");
        const data = fs.readFileSync(MNEMONIC_FILE, "utf8");
        return JSON.parse(data);
    }

    console.log("🆕 Génération d'un nouveau mnemonic...");
    const mnemonicSecretManager: MnemonicSecretManager = {
        mnemonic: Utils.generateMnemonic(),
    };

    fs.writeFileSync(MNEMONIC_FILE, JSON.stringify(mnemonicSecretManager, null, 2));
    console.log("✅ Mnemonic sauvegardé dans mnemonic.json");
    
    return mnemonicSecretManager;
}
