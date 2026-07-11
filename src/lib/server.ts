import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import path from 'path'

export interface ServerOptions {
  /** Port to run the server on (default: 3000) */
  port?: number
  /** Path to the dist directory, relative to app root (default: './dist') */
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

  // Resolve paths relative to the app root (process.cwd), not the module location
  const absoluteDistPath = path.resolve(process.cwd(), distPath)
  const clientPath = path.join(absoluteDistPath, 'client')

  const app = new Hono()

  // Serve static files from dist/client (mimics Next.js public/ behavior)
  // Files are checked first, falls through to SSR if not found
  app.use('/*', serveStatic({ root: clientPath }))

  // Optional extra static patterns (e.g. custom routes)
  for (const pattern of staticPatterns) {
    app.use(pattern, serveStatic({ root: clientPath }))
  }

  // Let TanStack Start handle everything else (SSR, server functions)
  app.all('*', async (c) => {
    const serverPath = path.join(absoluteDistPath, 'server', 'server.js')
    const handler = await import(serverPath)
    return handler.default.fetch(c.req.raw)
  })

  return {
    port,
    fetch: app.fetch.bind(app),
  }
}

export default createServer
