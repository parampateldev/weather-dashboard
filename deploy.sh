#!/bin/bash

# Build the weather dashboard
cd client
npm run build

# Create a simple server for the built files
cd dist
python3 -m http.server 8080
