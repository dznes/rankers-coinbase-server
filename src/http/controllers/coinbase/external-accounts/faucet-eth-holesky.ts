import { FastifyReply, FastifyRequest } from 'fastify'
import { Coinbase, ExternalAddress } from "@coinbase/coinbase-sdk";
import { coinbase } from '../../../lib/coinbase';

export async function faucetEthHolesky(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { user_address } = request.body as { user_address: string };

    // Instanciate the Coinbase SDK
    coinbase();

    // Create a new external address on the base sepolia network.
    const externalWallet = new ExternalAddress(Coinbase.networks.BaseSepolia, user_address);

    const faucetTransaction = await externalWallet.faucet();

    // Wait for transaction to land on-chain.
    await faucetTransaction.wait();

    let ethBalance = await externalWallet.getBalance(Coinbase.assets.Eth);


    return { 

      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      staking_wallet_address: address.id,
      // @ts-ignore: Property 'id' is protected and only accessible within class 'Address' and its subclasses.
      networkId: address.networkId,
      balances: [
        {
          asset: 'ETH',
          balance: ethBalance
        }
      ],
    }

  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
    return { error: error.message }
  }

  }

}