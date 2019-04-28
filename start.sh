#!/usr/bin/env bash

appname="work-job"
pm2 describe $appname > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start ./dist/index.js --name="$appname" -i 2
else
  pm2 reload $appname
fi;
