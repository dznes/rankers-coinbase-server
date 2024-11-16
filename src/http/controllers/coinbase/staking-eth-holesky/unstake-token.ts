import { coinbase } from "@/http/lib/coinbase";
import { Coinbase, StakeOptionsMode, Wallet } from "@coinbase/coinbase-sdk";
import { FastifyReply, FastifyRequest } from "fastify";


const { HOLESKY_WALLET_ID, HOLESKY_WALLET_SEED } = process.env;
const { BASE_WALLET_ID, BASE_WALLET_SEED } = process.env;

export async function unstake(request: FastifyRequest, reply: FastifyReply) {
  const { user, amount, asset } = request.body as { user: { walletId: string, seed: string }, amount: number, asset: string };
  let baseTransfer = false
  let stakeOperation = false

  coinbase()

  const companyHoleskyWallet = await Wallet.import({ walletId: HOLESKY_WALLET_ID ?? '', seed: HOLESKY_WALLET_SEED ?? '' });

  // Get the stakeable balance of the wallet.
  const stakeableBalance = await companyHoleskyWallet.stakeableBalance(asset, StakeOptionsMode.PARTIAL);

  if (Number(stakeableBalance) < amount) {
    return { error: "Insufficient balance to stake" }
  }

  // Since the time you first staked, it is possible that the amount of staked ETH has increased.
  // To determine the amount of ETH available to unstake, use the `unstakeableBalance` method as shown below.
  let unstakeableBalance = await companyHoleskyWallet.unstakeableBalance(asset, StakeOptionsMode.PARTIAL);

  if (Number(unstakeableBalance) < amount) {
    return { error: "Insufficient balance to unstake" }
  }

  // Create an unstake operation for an amount <= unstakeableBalance, in this case 0.0001 ETH.
  let unstakeOperation =  await companyHoleskyWallet.createUnstake(amount, asset, StakeOptionsMode.PARTIAL);

  let userBaseWallet = await Wallet.import(user);
  const companyBaseWallet = await Wallet.import({ walletId: BASE_WALLET_ID ?? '', seed: BASE_WALLET_SEED ?? '' });

  const transfer = await companyBaseWallet.createTransfer({
    amount,
    assetId: asset,
    destination: userBaseWallet,
  });

  // Wait for the transfer to settle.
  await transfer.wait()

  // Check if the transfer successfully completed on-chain.
  if (transfer.getStatus() !== 'complete') {
    return { result: {
      baseTransfer,
      stakeOperation, 
    }, transfer}
  } else {
    baseTransfer = true
  }

  return {
    result: {
      baseTransfer,
      stakeOperation: true,
    },
    transactionLink: unstakeOperation.getTransactions()[0].getTransactionLink(),
    unstakeOperation,
  }
}