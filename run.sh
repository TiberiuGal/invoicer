#!/bin/sh

set -e
VERSION=$(git describe --tags --always)
OUTNAME="invoicer-$VERSION"
LDFLAGS="-X invoicer.Version=$VERSION -s -w"

cmd="$1"
shift

case "$cmd" in
run)

  go run -ldflags="$LDFLAGS" cmd/invoicer/main.go $1
  ;;
build)
  echo "building invoicer"
  export GOOS=linux

  go build -o tmp/$OUTNAME -tags release -ldflags="$LDFLAGS" cmd/invoicer/main.go

  if [ $? -ne 0 ]; then
    echo "build failed"
    exit
  fi

  ;;
buildweb)
  echo "building static files"
  cd web-ui
  yarn build

  cp -r dist/* ../pb_public/
  ;;
deploy)

  echo "building static files"
  cd web-ui
  yarn build
  cd dist
  tar -czf ../tmp/staticfiles.tgz .
  cd ../..

  scp tmp/staticfiles.tgz tibi@zenc:/opt/invoicer/
  if [ $? -ne 0 ]; then
    echo "failed to copy staticfiles"
    exit
  fi
  ssh tibi@zenc "cd /opt/invoicer && tar -xzf staticfiles.tgz -C pb_public && rm staticfiles.tgz"
  if [ $? -ne 0 ]; then
    echo "deploying static files failed"
    exit
  fi

  scp tmp/$OUTNAME tibi@zenc:/opt/invoicer/
  if [ $? -ne 0 ]; then
    echo "scp failed"
    exit
  fi

  ssh tibi@zenc "sudo chmod +x /opt/invoicer/$OUTNAME  \
    && sudo ln -s -f /opt/invoicer/$OUTNAME pbinvoicer \
    && sudo systemctl restart invoicer.service "

  if [ $? -ne 0 ]; then
    echo "deploy failed"
    exit
  fi

  echo "deployed successfully\n"%

  ;;
esac
