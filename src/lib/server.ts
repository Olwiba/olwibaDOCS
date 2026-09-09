import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import path from 'path'

export interface ProtectedAssetOptions {
  /**
   * URL prefix whose assets require authorization, e.g. `/assets/protected/`.
   * The build must emit private chunks under this prefix.
   */
  prefix: string
  /**
   * Application route that decides access. It is dispatched through the SSR
   * handler with the incoming request's headers, and any non-2xx response is
   * returned to the caller in place of the asset.
   *
   * Delegating rather than accepting a callback keeps entitlement policy in the
   * application, using the same resolver as its protected loaders. A second
   * implementation living in the server entry is how the two come to disagree.
   */
  authorizePath: string
}

export interface ServerOptions {
  /** Port to run the server on (default: 3000) */
  port?: number
  /** Path to the dist directory, relative to app root (default: './dist') */
  distPath?: string
  /** Additional static file patterns to serve */
  staticPatterns?: string[]
  /**
   * Requires authorization before static delivery of a subset of assets.
   *
   * Static files are served ahead of the SSR handler, so a loader guard does
   * not protect the compiled chunks that contain the same content. Without
   * this, private documentation is downloadable by URL regardless of what the
   * application's loaders decide.
   */
  protectedAssets?: ProtectedAssetOptions
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
    protectedAssets,
  } = options

  // Resolve paths relative to the app root (process.cwd), not the module location
  const absoluteDistPath = path.resolve(process.cwd(), distPath)
  const clientPath = path.join(absoluteDistPath, 'client')

  const app = new Hono()

  let ssrHandler: { fetch: (request: Request) => Response | Promise<Response> } | null = null
  async function getSsrHandler() {
    if (!ssrHandler) {
      const serverPath = path.join(absoluteDistPath, 'server', 'server.js')
      ssrHandler = (await import(serverPath)).default
    }
    return ssrHandler!
  }

  // Authorization runs ahead of static delivery, because static delivery is the
  // path that would otherwise hand out the file.
  if (protectedAssets) {
    app.use(`${protectedAssets.prefix}*`, async (c, next) => {
      const url = new URL(c.req.url)
      const handler = await getSsrHandler()

      const decision = await handler.fetch(
        new Request(new URL(protectedAssets.authorizePath, url.origin), {
          method: 'GET',
          headers: c.req.raw.headers,
        }),
      )

      if (!decision.ok) {
        // Mirror the application's answer rather than inventing one, so a
        // redirect to sign-in stays a redirect and a refusal stays a refusal.
        return decision
      }

      await next()

      // Entitlement-dependent, so it must never enter a shared cache.
      c.res.headers.set('Cache-Control', 'private, no-store')
    })
  }

  // Serve static files from dist/client (mimics Next.js public/ behavior)
  // Files are checked first, falls through to SSR if not found
  app.use('/*', serveStatic({ root: clientPath }))

  // Optional extra static patterns (e.g. custom routes)
  for (const pattern of staticPatterns) {
    app.use(pattern, serveStatic({ root: clientPath }))
  }

  // Let TanStack Start handle everything else (SSR, server functions)
  app.all('*', async (c) => {
    const handler = await getSsrHandler()
    return handler.fetch(c.req.raw)
  })

  return {
    port,
    fetch: app.fetch.bind(app),
  }
}

export default createServer
