ARG NODE_VERSION=26

FROM node:${NODE_VERSION}-alpine AS base
RUN npm install -g pnpm@11
WORKDIR /src
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

FROM base AS deps
RUN pnpm install --frozen-lockfile --prod
RUN rm -rf node_modules/.pnpm/typescript@* node_modules/.pnpm/*/node_modules/typescript

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production \
    PORT=20099
WORKDIR /app

COPY --from=deps /src/node_modules ./node_modules
COPY --from=build /src/build ./build
COPY --from=build /src/dist ./dist
COPY package.json ./

USER node
EXPOSE 20099

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:$PORT/api/health || exit 1

CMD ["node", "dist/server.js"]
