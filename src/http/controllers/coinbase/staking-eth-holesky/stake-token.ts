import { coinbase } from "@/http/lib/coinbase";
import { StakeOptionsMode, Wallet } from "@coinbase/coinbase-sdk";
import { FastifyReply, FastifyRequest } from "fastify";


const { HOLESKY_WALLET_ID, HOLESKY_WALLET_SEED } = process.env;
const { BASE_WALLET_ID, BASE_WALLET_SEED } = process.env;

export async function stake(request: FastifyRequest, reply: FastifyReply) {
  const { user, amount, asset } = request.body as { user: { walletId: string, seed: string }, amount: number, asset: string };
  let baseTransfer = false
  let stakeOperation = false

  coinbase()
 
  let userBaseWallet = await Wallet.import(user);

  // let balance = await importedWallet.listBalances();
  let ethBalance = await userBaseWallet.getBalance(asset);

  if (Number(ethBalance) < amount) {
    return { error: "Insufficient balance to stake" }
  }

  const companyBaseWallet = await Wallet.import({ walletId: BASE_WALLET_ID ?? '', seed: BASE_WALLET_SEED ?? '' });


  const transfer = await userBaseWallet.createTransfer({
    amount,
    assetId: asset,
    destination: companyBaseWallet,
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

  const companyHoleskyWallet = await Wallet.import({ walletId: HOLESKY_WALLET_ID ?? '', seed: HOLESKY_WALLET_SEED ?? '' });

  if (!baseTransfer) {
    return { error: "Failed to transfer funds" }
  }

  // Get the stakeable balance of the wallet.
  const stakeableBalance = await companyHoleskyWallet.stakeableBalance(asset, StakeOptionsMode.PARTIAL);

  if (Number(stakeableBalance) < amount) {
    return { error: "Insufficient balance to stake" }
  }

  const stakingOperation = await companyHoleskyWallet.createStake(amount, asset, StakeOptionsMode.PARTIAL);

  return {
    result: {
      baseTransfer,
      stakeOperation: true,
    },
    transactionLink: stakingOperation.getTransactions()[0].getTransactionLink(),
    stakingOperation,
  }
}