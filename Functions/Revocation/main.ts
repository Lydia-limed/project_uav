import { desactiverDid } from "./deactivateIdentity";

const dids = [
  "did:iota:snd:0xfbc9791d41377890a5893b72b2738c7580ffbcb5e6a13e7ecbab42bdce275ee9",
  "did:iota:snd:0xe22e647abfd882659765f8aff6ec9d4594e19da15c7dd1f8f981fde750b69f1b",
  "did:iota:snd:0xdf1dc8b89b9d79a1e815afac4c0623e1b5b12396cfb7d6d8a777d32c53d928a3",
  "did:iota:snd:0x218b89852812a3442db9147a7680a1534abb76c513969364bae200a929d4b7e8",
  "did:iota:snd:0x1cf3e3356fd7bf5e3843de62b287a60d67b0a12c334ebf9debd8c81992926e08",
  "did:iota:snd:0x8563431e5fd6235310bbe8781e327b6033aea6d5bfd90b4e5b621ed9c935cda1",
  "did:iota:snd:0x44e90982e93f19a6a767601f844c85f34c300a94ba13cdd726472abd334f41c5",
  "did:iota:snd:0xa505150d5adb90a9ca429393ff84aec021b6bc40e5198365c137827be12716a4",
  "did:iota:snd:0xad7dde8706c102c3527de7eedaf7751d43ac9696818779e457e0a577d5b06c2f",
  "did:iota:snd:0x4d7846523af7fd079c42d43f15ae4ff4f36afe87b64252d29893d59c273c4dd7",
  "did:iota:snd:0x416cb4d9ac857fbe681cfff7508ec2eb81fef4de5c0c2ce94732b4f6685ad283",
  "did:iota:snd:0x6977f33ac5dfc7a2201a6d95afba1a5eab2a30d8b0ab2c65abc9f5b00d9d5dc5",
  "did:iota:snd:0x7bdfc5b7c812593614521d6b677229ccc7f8db40cacd2a369651736836f780bd",
  "did:iota:snd:0xf83423f3f10c320b823d9c1596ca42c9da0d8398765268b6476e98975f6b3231",
  "did:iota:snd:0xdf5dc2dc0e45734acf3e725c8bff52831eda45722672d021b17a0839b5e89b39",
  "did:iota:snd:0xd55b01b34f74c4fb27c64802d661253beb03ca004707e7982796ca6a7863801b",
  "did:iota:snd:0x4a22715bf2637108de3ccf4de59693be6de4fd2015372f60f63675b3ba12a87b",
  "did:iota:snd:0x9a04c5b31c8b065ad5c4a6bb033b8aba43c73605322756f2343f82a4521b4f4e",
  "did:iota:snd:0xd30d8f1376f5ee2faa545d9eb3cb3cfc255f9860620356488856d26b28636ad5",
  "did:iota:snd:0xde988872ff9eef04332643e504e44ce32f8f234346eb4c406f14e85655b9fba1",
  "did:iota:snd:0x3d97f15ee28a9c7cf7c95f36572b07534040b6375893cd404db653621627ff16",
  "did:iota:snd:0x7fb14cefae64510b6c76653a77c2e1b566edb561450121cfc03c977b93e36d9c",
  "did:iota:snd:0xc24b00c66886b951db9e0ad43903a3cccc282d308f7a5a30cf8b0dbcbb4eb5fa",
  "did:iota:snd:0x303e3499759b4fa4c1da395fd0b0bada3d2618c41a85ebb46427c50886bbc520",
  "did:iota:snd:0xd1caa3f8edb149fed1516d9afac42444fa7dad65473b01f1000ef7b322737d74",
  "did:iota:snd:0x1628cddcc38d4073a1d964b8a125f5a520f1dd6be8df8665a42cf67f405b306b",
  "did:iota:snd:0xf4dc3345c2e4ccd1aa398f277c94daaccd9153a872a9540094a634b1cc2d508b",
  "did:iota:snd:0x0cda70d5dec5ef8c1604941eaa42027815808161c2c54f32713bde4346650255",
  "did:iota:snd:0xa656017365aca97782fb577542bb0c6412e6fc9ce99bd7ce46d2b7e3d39e8238",
  "did:iota:snd:0x71d70caf5c3e44e7c1c59c91bec7c7b59c94c706ba9830ebe59a78fadf5c9bb4",
  "did:iota:snd:0xfeca204b5a02be654f9aec3a3673881d6627e16b95594caad58d0386f112ec0f",
  "did:iota:snd:0x0337ceb8ce279dd4fbe47c467c7d96283230e6099dd33f05c64287100902f6cf",
  "did:iota:snd:0x5ba46f87c3763be3080b56d29c774d7f8d9e2b4d2dbc8d32a314aad457aa0f4a",
  "did:iota:snd:0x45dde0dd584d24a2ecaf3e40a603227957b650dfd75362bbcc7f30f106b408e2",
  "did:iota:snd:0x12e487f94823901f9f8c5b9fccd99cdcdabf0d20679f7ca8b025b998acf653bc",
  "did:iota:snd:0xb5b27287e0951bbf8517b2c7b80ecff7fae0428d23c82a046db5022746d41621",
  "did:iota:snd:0xefa7de8159a5315b83475e98a7adc32cab244478ed020e757b3db9ec1b2601ba",
  "did:iota:snd:0x75a5b991664c1dd2f53439e75480826eb05fc4fb281f60b2602b89e889175c81",
  "did:iota:snd:0x3ca560228e45970db58aa88c6ce441b6c3953c068d03a8d86900b6d77d87c975",
  "did:iota:snd:0x44b107bffba670cc0f703dbf4741e9e1f6f3e2fc04c5b5d68e17adbede563ee8",
  "did:iota:snd:0x5a180b809c8714244cac7719e4331bf0e6c23ec413246faf39617732d4e94579",
  "did:iota:snd:0x19ec2a03cb3e51da29b3c12c2b8a10ec5874348db0ee044964d0d97a8663ed3e",
  "did:iota:snd:0x9869537565ac817b02a5b8f6f5a1a6d77daac78def6003fd763e1a7f34718e61",
  "did:iota:snd:0x59babcdada65df51ca780309e1a3b7108b5ce1a6840aa849779cb49c9c1ac11f",
  "did:iota:snd:0xf25eaea4c048ec1637246c1cbb4513c3116a56b7382699b42ab0987d07c397dd",
  "did:iota:snd:0x02dc7dad639cb6e0420868aca16dda4f4d65ce1d994faefdc7b5ad5172ca9d2c",
  "did:iota:snd:0xd91532dffd32b7032ab6363673ee182f80c37df220299e06e7aedd9b911171a3",
  "did:iota:snd:0xaaeae4507059b46282b7bb69dab56419d10e5e8f21a2c5c9111c248ff24d8c27",
  "did:iota:snd:0xbd08e9c0cf9f52bcf4a7390fb5b53166d3fe10300776b6b3631feaf089e5210c",
  "did:iota:snd:0x430cab59dded05e4bb8ba1b58b2021a10b2ff1b9eefbcbe0f3b115ee46ff2d43"
]
async function deactivateDIDs() {
    for (const did of dids) {
        try {
            await desactiverDid(did); // Assurez-vous que desactiverDid est une fonction asynchrone.
            console.log(`✅ DID ${did} désactivé avec succès`);
        } catch (error) {
            console.error(`❌ Erreur lors de la désactivation du DID ${did}:`, error);
        }
    }
}

// Appeler la fonction pour commencer la désactivation des DIDs
deactivateDIDs();

