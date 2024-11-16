import { FastifyReply, FastifyRequest } from 'fastify'
import { ExternalAddress, Wallet } from "@coinbase/coinbase-sdk";
import { coinbase } from '../../lib/coinbase';

interface WalletInfo {
  walletId: string,
  seed: string
}
enum Asset {
  ETH = "eth",
  USDC = "usdc",
}


export async function transferFunds(request: FastifyRequest, reply: FastifyReply) {
  try {

    const { sender, reciever, reciever_address, amount, asset } = request.body as { sender: WalletInfo, reciever?: WalletInfo, reciever_address?: string, amount: number, asset: Asset };

    // Instanciate the Coinbase SDK
    coinbase();
    
    let senderWallet = await Wallet.import(sender);
    let recieverWallet

    if (reciever?.walletId && reciever?.seed) {
      recieverWallet = await Wallet.import(reciever);
    } else if (reciever_address) {
      recieverWallet = new ExternalAddress("base-sepolia", reciever_address);
    }

    if (!recieverWallet) {
      return { message: "Please add reciever info with walletId and seed or reciever_address." }
    }

    const transfer = await senderWallet.createTransfer({
      amount,
      assetId: asset,
      destination: recieverWallet,
    });

    // Wait for the transfer to settle.
    await transfer.wait()

    // Check if the transfer successfully completed on-chain.
    if (transfer.getStatus() === 'complete') {
      return { result: "success", transfer}
    } else {
      return { result: "failed", transfer}
    }


  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
   }
  }
}