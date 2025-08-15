#!/bin/bash

# Cleanup
rm -rf dist artifact.zip
# Install deps
deno install
# Create bundle
deno task build
# Create zipet
cd dist; zip -r -D ../artifact.zip .
