#!/bin/bash
set -e

echo "Installing pnpm..."
npm install -g pnpm@8.15.0

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building UI package..."
cd packages/ui
pnpm build || true
cd ../..

echo "Building utils package..."
cd packages/utils
pnpm build || true
cd ../..

echo "Generating static site..."
cd apps/recruiter-dashboard
pnpm generate

echo "Build complete!"
