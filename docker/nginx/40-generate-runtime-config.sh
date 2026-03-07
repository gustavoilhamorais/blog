#!/bin/sh
set -eu

: "${BLOG_POSTS_ENDPOINT:=http://localhost:80/blog/posts}"

envsubst '${BLOG_POSTS_ENDPOINT}' \
  < /opt/blog/runtime-config.template.js \
  > /tmp/runtime-config.js
