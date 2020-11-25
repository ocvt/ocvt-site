#!/bin/bash

set -e

# substitute api.cabinet.seaturtle.pw with whatever your dev API_URL value is
up () {
   docker run \
    --name ocvt-site \
    --detach \
    --restart unless-stopped \
    --env-file ocvt-site.env \
    --publish 4000:4000 \
    --add-host=api.cabinet.seaturtle.pw:$(ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+') \
    ocvt/ocvt-site:latest

  docker system prune -af
}

down () {
  stop
  docker rm -f ocvt-site || true
}

stop () {
  docker stop ocvt-site || true
}

logs () {
  docker logs -f ocvt-site
}

###

build () {
  docker build -t ocvt/ocvt-site:latest .
}

# see package.json for more commands

$@
