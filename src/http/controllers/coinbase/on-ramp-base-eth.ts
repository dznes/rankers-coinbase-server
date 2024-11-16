
import { FastifyReply, FastifyRequest } from 'fastify'

export async function onRampBaseEth(request: FastifyRequest, reply: FastifyReply) {
  const { user_address } = request.params as { user_address: string };

  const url = `https://pay.coinbase.com/buy/select-asset?addresses={"${user_address}":["base"]}&assets=[ETH]`

  try {
    return { url}

  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
   }
  }
}