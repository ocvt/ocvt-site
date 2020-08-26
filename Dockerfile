FROM node:12.18.3-alpine

LABEL maintainer="Paul Walko <paulsw.pw@gmail.com>"

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 4000
CMD ["node", "app.js"]
