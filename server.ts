import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

// Serve static files from dist/client (mimics Next.js public/ behavior)
// Files are checked first, falls through to SSR if not found
app.use('/*', serveStatic({ root: './dist/client' }))

// Let TanStack Start handle everything else (SSR, server functions).
// Imported at boot so a broken build fails fast instead of on first request.
const handler = await import('./dist/server/server.js')
app.all('*', (c) => handler.default.fetch(c.req.raw))

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
}
