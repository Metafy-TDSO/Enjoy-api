FROM node:16-alpine

WORKDIR /var/app

COPY package.json yarn.lock .yarnrc.yml ./

COPY .yarn .yarn

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma:generate && yarn build

COPY .docker/entrypoint.sh .

ENV NODE_ENV production

USER node

EXPOSE 3000

ENTRYPOINT [ "sh", "./entrypoint.sh" ]
