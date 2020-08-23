#!/bin/bash

build () {
  if [ -n "$1" ]; then
    docker build -t ocvt/ocvt-site:"$1" .
  else
    docker build -t ocvt/ocvt-site:latest .
  fi
}

test () {
  yarn compile
  yarn lint
}

test-fix () {
  yarn lint-fix
}

up () {
  docker-compose up
}

$@
