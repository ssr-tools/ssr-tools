#!/bin/bash

# The script should run before `git push`, so that we can see whether there's
# something todo before pushing the code.

todos=$(cat ._/TODO.md \
  | sed -n -e '/TODO start/,$p' \
  | sed -e "/TODO end/,\$d" \
  | tail -n +2)

length=${#todos}

echo "Checking whether we have some todos in ./._/TODO.md..."

if [[ $length > 0 ]]; then
  echo "We have some todos left in ./._/TODO.md:"
  printf "%s" "$todos"
  printf "\n"
  printf "\n"
  echo "If you'd like to push anyway use --no-verify option."
  exit 1
else 
  echo "No todos found..."
fi
