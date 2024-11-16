import { FastifyReply, FastifyRequest } from 'fastify'
import { Coinbase, ExternalAddress, Wallet } from "@coinbase/coinbase-sdk";
import { coinbase } from '../../../lib/coinbase';

export async function getBalance(request: FastifyRequest, reply: FastifyReply) {
  try {

    const { user_address } = request.params as { user_address: string};

    // Instanciate the Coinbase SDK
    coinbase();

    // Create a new external address on the base sepolia network.
    const externalWallet = new ExternalAddress(Coinbase.networks.BaseSepolia, user_address);
    const holeskyWallet = new ExternalAddress(Coinbase.networks.EthereumHolesky, user_address);

    // let balance = await importedWallet.listBalances();
    let ethBalance = await externalWallet.getBalance(Coinbase.assets.Eth);
    let uscBalance = await externalWallet.getBalance(Coinbase.assets.Usdc);

    return { 
      user_address,
      balances: [
        {
          asset: 'ETH',
          balance: ethBalance,
          chain: 'BaseSepolia'
        },
        {
          asset: 'USDC',
          balance: uscBalance,
          chain: 'BaseSepolia'
        },
        {
          asset: 'ETH',
          balance: ethBalance,
          chain: 'EthereumHolesky'
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