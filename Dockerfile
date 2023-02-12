FROM node:18.14.0-alpine

LABEL org.opencontainers.image.source https://github.com/ocvt/ocvt-site
LABEL maintainer="Paul Walko <paulsw.pw@gmail.com>"

RUN \
  apk upgrade --update && \
  apk add -U tzdata && \
  cp /usr/share/zoneinfo/US/Eastern /etc/localtime && \
  echo "US/Eastern" > /etc/timezone && \
  apk del tzdata && \
  rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 4000
CMD ["node", "app.js"]
