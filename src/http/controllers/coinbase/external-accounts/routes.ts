import { FastifyInstance } from 'fastify'
import { faucetEth } from './faucet-eth'
import { getBalance } from './get-balance'
import { stake } from './stake'
import { faucetEthHolesky } from './faucet-eth-holesky'


export async function CoinbaseExternalAccountRoutes(app: FastifyInstance) {
  app.post("/coinbase/external/faucet/eth", faucetEth)
  app.post("/coinbase/external/faucet/eth-holesky", faucetEthHolesky)
  app.get("/coinbase/external/balance/:user_address", getBalance)
  app.post("/coinbase/external/stake", stake)
}
