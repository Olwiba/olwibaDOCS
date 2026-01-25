import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

// Serve static assets from dist/client
app.use('/assets/*', serveStatic({ root: './dist/client' }))
app.use('/favicon.ico', serveStatic({ root: './dist/client' }))

// Let TanStack Start handle everything else (SSR, server functions)
app.all('*', async (c) => {
  const handler = await import('./dist/server/server.js')
  return handler.default.fetch(c.req.raw)
})

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
}
