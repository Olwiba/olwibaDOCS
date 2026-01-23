FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
ARG NPM_TOKEN
COPY package.json bun.lock* ./
RUN echo '[install.scopes]' > bunfig.toml && \
    echo "\"@olwiba\" = { url = \"https://npm.olwiba.com/\", token = '${NPM_TOKEN}' }" >> bunfig.toml && \
    echo "\"@genesis\" = { url = \"https://npm.olwiba.com/\", token = '${NPM_TOKEN}' }" >> bunfig.toml && \
    bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bunfig.toml ./bunfig.toml
COPY . .
RUN bun run web:build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["bun", "run", "start"]
