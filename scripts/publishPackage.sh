#!/bin/bash

# Use it in package.json#publishPackage script in libs.
#
# This is the script that publishes the lib. By using this script we can avoid
# "dist" in our users' imports.
#
# This way our users don't import like: 
#   import { foo } from "lib-name/dist/foo"
# 
# But like: 
#   import { foo } from "lib-name/foo"

npm run build
cp package.json ./dist/package.json
cp README.md ./dist/README.md
sed -i 's/..\/..\/scripts\/prepublishOnly.sh/..\/..\/..\/scripts\/prepublishOnly.sh/' ./dist/package.json
cd dist
npm publish --access public
cd ..