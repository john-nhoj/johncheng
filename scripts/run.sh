#!/bin/bash
# Immediately fail on errors
set -e;

echo "Starting Node.js application with configuration '${CONFIGURATION}'.";
# exec is used to pass signals to the running process, for example when stopping a container
# Read more at https://docs.docker.com/engine/reference/builder/#exec-form-entrypoint-example
exec npm run start;
