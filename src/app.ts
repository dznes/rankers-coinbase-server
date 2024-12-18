import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { ZodError } from 'zod'
import { env } from './env'
import { AppRoutes } from './http/controllers/routes'
import { CoinbaseRoutes } from './http/controllers/coinbase/routes'
import { CoinbaseExternalAccountRoutes } from './http/controllers/coinbase/external-accounts/routes'
// import { CoinbaseRoutes } from './http/controllers/coinbase/routes'

export const app = fastify()

// Register @fastify/cors with options as needed
app.register(fastifyCors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:3010',
    'https://dznes-store.vercel.app',
  ], // Allowed origins
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
})

app.register(AppRoutes)
app.register(CoinbaseRoutes)
app.register(CoinbaseExternalAccountRoutes)
// Ao adicionar o "_" na frente do parâmetro que não vai ser utilizado ou apenas o "_" no lugar do parâmetro, você informa que ele não vai ser utilizado.
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: `Validation error`, issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
