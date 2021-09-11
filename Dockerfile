FROM node:14.17.6-alpine

WORKDIR /app

COPY yarn.lock package.json tsconfig.json /app/
COPY ./src /app/src

RUN yarn --dev
RUN yarn build

CMD ['yarn', 'start']
