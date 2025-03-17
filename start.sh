#!/bin/sh

# Start PocketBase in the background
/pb/pocketbase serve --http="0.0.0.0:8090" --dir="/pb/pb_data" &

# Start Next.js
cd /app && npm run start