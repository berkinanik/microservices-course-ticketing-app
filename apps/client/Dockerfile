FROM node:alpine

WORKDIR /usr/app

RUN npm i -g pnpm@9
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm i
COPY . .

CMD ["pnpm", "run", "dev"]