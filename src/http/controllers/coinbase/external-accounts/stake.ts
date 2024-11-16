import { coinbase } from "@/http/lib/coinbase";
import { Coinbase, ExternalAddress, StakeOptionsMode, Wallet } from "@coinbase/coinbase-sdk";
import { FastifyReply, FastifyRequest } from "fastify";
import { ethers } from 'ethers';

const COMPANY_WALLET_PRIVATE_KEY = process.env.COMPANY_WALLET_PRIVATE_KEY

export async function stake(request: FastifyRequest, reply: FastifyReply) {
  const { user_address, amount } = request.body as { user_address: string, amount: number };
  // let baseTransfer = false
  // let stakeOperation = false

  coinbase()

  if (user_address) {
    // Create a new external address on the `ethereum-holesky` network.
    let address = new ExternalAddress(Coinbase.networks.EthereumHolesky, user_address);

    console.log(address)
    
    // Find out how much ETH is available to stake.
    const stakeableBalance = await address.stakeableBalance(Coinbase.assets.Eth, StakeOptionsMode.PARTIAL);

    if (amount > Number(stakeableBalance)) {
      return { error: "Insufficient balance to stake" }
    }

    // Build a stake transaction for an amount <= stakeableBalance
    const stakingOperation = await address.buildStakeOperation(amount, Coinbase.assets.Eth, StakeOptionsMode.PARTIAL);

    // Example of polling the stake operation status until it reaches a terminal state.
    await stakingOperation.wait();

    // Load your wallet's private key from which you initiated the above stake operation.
    const wallet = new ethers.Wallet(COMPANY_WALLET_PRIVATE_KEY ?? '');

    // Sign the transactions within staking operation resource with your wallet.
    await stakingOperation.sign(wallet);

    // For Holesky, publicly available RPC URL's can be found here https://chainlist.org/chain/17000
    const provider = new ethers.JsonRpcProvider("https://ethereum-holesky-rpc.publicnode.com");

    // Broadcast each of the signed transactions to the network.
    const test = stakingOperation.getTransactions().forEach(async tx => {
        let resp = await provider.broadcastTransaction(tx.getSignedPayload()!);
        console.log(resp);
    });

    return { test }

  }
}