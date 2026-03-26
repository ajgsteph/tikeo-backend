#!/bin/sh
set -e

echo "DATABASE_URL is: ${DATABASE_URL:0:10}..."  # print first 10 chars to verify it's set

npx prisma migrate deploy
exec node dist/index.js