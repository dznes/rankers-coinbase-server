import { FastifyReply, FastifyRequest } from 'fastify'
import { Coinbase, ExternalAddress, Wallet } from "@coinbase/coinbase-sdk";
import { coinbase } from '../../../lib/coinbase';

export async function addWalletFundEthHolensky(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { walletId, seed } = request.body as { walletId: string, seed: string };

    // Instanciate the Coinbase SDK
    coinbase();

    let importedWallet = await Wallet.import({ walletId, seed });
    
    let address = await importedWallet.getDefaultAddress();

    const faucetTransaction = await importedWallet.faucet();

    // Wait for transaction to land on-chain.
    await faucetTransaction.wait();

    let ethBalance = await importedWallet.getBalance(Coinbase.assets.Eth);


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