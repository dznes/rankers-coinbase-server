import { FastifyReply, FastifyRequest } from 'fastify'
import { Coinbase, ExternalAddress, Wallet } from "@coinbase/coinbase-sdk";
import { coinbase } from '../../lib/coinbase';



export async function addWalletFundUsdc(request: FastifyRequest, reply: FastifyReply) {
  try {

    const { walletId, seed, user_address } = request.body as { walletId: string, seed: string, user_address?: string };

    // Instanciate the Coinbase SDK
    coinbase();

    // if (user_address) {
    //   // Create a new external address on the base sepolia network.
    //   const externalWallet = new ExternalAddress(Coinbase.networks.BaseSepolia, user_address);
    //   // console.log(externalWallet)
  
    //   // Create a faucet request that returns a Faucet transaction, which can be used to retrieve the transaction hash.
    //   let faucetTransaction = await externalWallet.faucet(Coinbase.assets.Usdc);
  
    //   // Wait for the faucet transaction to land on-chain.
    //   await faucetTransaction.wait();
  
  
    //   return { 
    //     // wallet,
    //     // address,
    //     // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
    //     address: externalWallet.id,
    //     // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
    //     networkId: externalWallet.networkId,
    //   }
    // }
 
    let importedWallet = await Wallet.import({ walletId, seed });
    let address = await importedWallet.getDefaultAddress();

    // Create a faucet request that returns a Faucet transaction, which can be used to retrieve the transaction hash.
    let faucetTransaction = await importedWallet.faucet(Coinbase.assets.Usdc);

    // Wait for the faucet transaction to land on-chain.
    await faucetTransaction.wait();


    return { 
      // wallet,
      // address,
      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      address: address.id,
      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      networkId: address.networkId,
    }

  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
   }
  }
}