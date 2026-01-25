import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

export interface ServerOptions {
  /** Port to run the server on (default: 3000) */
  port?: number
  /** Path to the dist directory (default: './dist') */
  distPath?: string
  /** Additional static file patterns to serve */
  staticPatterns?: string[]
}

/**
 * Creates a production server for TanStack Start apps with Fumadocs.
 *
 * TanStack Start v1 compiles to a fetch handler only - it doesn't serve static files.
 * This server uses Hono to serve static assets from dist/client and routes
 * everything else to TanStack Start's SSR handler.
 *
 * @example
 * ```ts
 * // server.ts
 * import { createServer } from '@olwiba/docs/server'
 * export default createServer()
 * ```
 *
 * @example
 * ```ts
 * // With custom options
 * import { createServer } from '@olwiba/docs/server'
 * export default createServer({ port: 8080 })
 * ```
 */
export function createServer(options: ServerOptions = {}) {
  const {
    port = Number(process.env.PORT) || 3000,
    distPath = './dist',
    staticPatterns = [],
  } = options

  const app = new Hono()
  const clientPath = `${distPath}/client`

  // Serve static assets from dist/client
  app.use('/assets/*', serveStatic({ root: clientPath }))
  app.use('/favicon.ico', serveStatic({ root: clientPath }))

  // Serve additional static patterns if provided
  for (const pattern of staticPatterns) {
    app.use(pattern, serveStatic({ root: clientPath }))
  }

  // Let TanStack Start handle everything else (SSR, server functions)
  app.all('*', async (c) => {
    const handler = await import(`${distPath}/server/server.js`)
    return handler.default.fetch(c.req.raw)
  })

  return {
    port,
    fetch: app.fetch,
  }
}

export default createServer
