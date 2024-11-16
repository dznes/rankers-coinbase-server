import { FastifyReply, FastifyRequest } from 'fastify'
import { Coinbase, ExternalAddress, Wallet } from "@coinbase/coinbase-sdk";
import { coinbase } from '../../../lib/coinbase';

export async function faucetEth(request: FastifyRequest, reply: FastifyReply) {
  try {

    const { user_address } = request.body as { user_address?: string };

    if (!user_address) {
      return { error: "Please provide a user_address." }
    }

    // Instanciate the Coinbase SDK
    coinbase();

    // Create a new external address on the base sepolia network.
    const externalWallet = new ExternalAddress(Coinbase.networks.BaseSepolia, user_address);
    // console.log(externalWallet)

    // Create a faucet request that returns a Faucet transaction, which can be used to retrieve the transaction hash.
    let faucetTransaction = await externalWallet.faucet(Coinbase.assets.Eth);

    // Wait for the faucet transaction to land on-chain.
    await faucetTransaction.wait();


    return { 
      // wallet,
      // address,
      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      address: externalWallet.id,
      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      networkId: externalWallet.networkId,
    }

  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
   }
  }
}