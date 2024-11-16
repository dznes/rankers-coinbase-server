import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
// Change this to the path of your API key file downloaded from CDP portal.
Coinbase.configureFromJson({ filePath: "../cdp_api_key.json" });
export async function main() {
    // Create a Wallet for the User.
    let wallet = await Wallet.create();
    console.log(`Wallet successfully created: `, wallet.toString());
    // Wallets come with a single default Address, accessible via getDefaultAddress:
    let address = await wallet.getDefaultAddress();
    console.log(`Default address for the wallet: `, address.toString());
}
main();
