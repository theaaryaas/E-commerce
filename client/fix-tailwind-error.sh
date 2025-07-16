#!/bin/sh
rm -rf node_modules .next .cache dist build package-lock.json
echo "✅ Removed node_modules, .next, .cache, dist, build, and package-lock.json"
npm install
echo "✅ npm install complete"
npm run dev 