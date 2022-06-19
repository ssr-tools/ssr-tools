#!/bin/bash

# The script should run before `git push`, so that we can see whether there's
# something todo before pushing the code.

yellowColor="\033[0;33m"
resetColor="\033[0m"
bold=$(tput bold)

todos=$(cat ._/TODO.md \
  | sed -n -e '/TODO start/,$p' \
  | sed -e "/TODO end/,\$d" \
  | tail -n +2)

length=${#todos}

echo "Checking whether we have some todos in ./._/TODO.md..."

if [[ $length > 0 ]]; then
  printf "\n"
  printf "\n"
  echo -e "⚠️ ${yellowColor} ${bold}We have some todos left in ./._/TODO.md ⚠️${resetColor}"
  printf "%s" "$todos"
  printf "\n"
  printf "\n"
else 
  echo "No todos found..."
fi
