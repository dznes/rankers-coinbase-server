import { FastifyInstance } from 'fastify'
import { createWallet } from './create-wallet';
import { getWalletById } from './get-wallet-by-id';
import { addWalletFundEth } from './add-wallet-fund-eth';
import { transferFunds } from './transfer-funds';
import { getWalletBalances } from './get-wallet-balance';
import { addWalletFundUsdc } from './add-wallet-fund-usdc';
import { onRampBaseEth } from './on-ramp-base-eth';
import { stake } from './staking-eth-holesky/stake-token';
import { addWalletFundEthHolensky } from './staking-eth-holesky/add-wallet-fund-eth-holenksy';
import { getStakeWalletBalances } from './staking-eth-holesky/get-wallet-balance';

export async function CoinbaseRoutes(app: FastifyInstance) {
  app.get("/coinbase/create-wallet", createWallet)
  app.post("/coinbase/get-wallet-by-id", getWalletById)

  app.post("/coinbase/add-wallet-fund/eth", addWalletFundEth)
  app.post("/coinbase/add-wallet-fund/usdc", addWalletFundUsdc)
  app.post("/coinbase/add-wallet-fund/eth/holensky", addWalletFundEthHolensky)

  app.post("/coinbase/transfer-funds", transferFunds)
  app.post("/coinbase/get-wallet-balances", getWalletBalances)

  app.post("/coinbase/stake/get-wallet-balances", getStakeWalletBalances)
  app.get("/coinbase/on-ramp-base-eth/:user_address", onRampBaseEth)
  app.post("/coinbase/stake", stake)
}
