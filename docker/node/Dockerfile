FROM node:lts AS base

WORKDIR /usr/nok

COPY package.json yarn.lock prisma ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base AS production

RUN yarn build
