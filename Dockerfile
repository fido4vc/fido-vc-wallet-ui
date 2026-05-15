# fido-vc-wallet-ui — Next.js 16 / React 19
# Build context: this repo's root.

FROM node:22-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* are inlined into the client bundle at build time, so they must
# be present before `npm run build`. Defaults assume the docker-compose demo
# (host-side ports). Override with --build-arg at image-build time if you're
# deploying to different hostnames.
ARG NEXT_PUBLIC_WALLET_API_URL=http://localhost:7001
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
ENV NEXT_PUBLIC_WALLET_API_URL=$NEXT_PUBLIC_WALLET_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
