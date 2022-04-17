#!/bin/bash

# Use it in package.json#build script in libs.
#
# This is the script that builds the lib's code. To avoid repeating it in all
# libs package.json, we define it here,

rm -rf dist
npm i
tsc -p ./tsconfig.json
