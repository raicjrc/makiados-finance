#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
exec /usr/local/bin/node bot.js >> "$DIR/bot.log" 2>&1
