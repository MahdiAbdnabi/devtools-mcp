#!/usr/bin/env bash
set -eu
node "$(dirname "$0")/gen-events.mjs" > events.json
