FROM node:18-alpine as base

FROM base as builder
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM base as production
WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["yarn", "start"]

LABEL org.opencontainers.image.source=https://github.com/dimigo-din/dimigoin-back