import { FastifyReply, FastifyRequest } from 'fastify'
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { coinbase } from '../../lib/coinbase';

export async function createWallet(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Instanciate the Coinbase SDK
    coinbase();

    let wallet = await Wallet.create({ networkId: Coinbase.networks.BaseSepolia });
    console.log(`Wallet successfully created: `, wallet.toString());

    let address = await wallet.getDefaultAddress();
    console.log(`Default address for the wallet: `, address.toString());

    // Export the data required to re-instantiate the wallet. The data contains the seed and the ID of the wallet.
    let { walletId, seed } = wallet.export();


    return { 

      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      address: address.id,
      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      networkId: address.networkId,
      walletId,
      seed,
    }

  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
    return { error: error.message }
  }

  }

}