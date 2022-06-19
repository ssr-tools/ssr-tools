#!/bin/bash

# Use it in package.json#preblishOnly script in libs. 
# 
# We want to run "publish" script only from the lib's "dist" directory.
#
# This way our users don't import like: 
#   import { foo } from "lib-name/dist/foo"
# 
# But like: 
#   import { foo } from "lib-name/foo"

current_location=$(pwd)

echo $current_location
echo "Checking if publish script is running in \"*/dist\" dir..."

if [[ $current_location =~ ^.*dist$ ]]; then
  echo "OK, publish script is running in \"*/dist\"."
  exit 0
else
  echo "Ups, publish script is running from ${current_location}."
  echo "It probably means you're using \"npm publish\", instead of \"npm run publishPackage\"."
  exit 1
fi