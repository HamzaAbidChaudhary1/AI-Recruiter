#!/bin/bash

# Install pnpm
npm install -g pnpm

# Navigate to the frontend directory
cd ai-recruit-frontend

# Install dependencies
pnpm install --frozen-lockfile

# Build the recruiter dashboard
pnpm build:recruiter

# Create the dist directory structure that Netlify expects
mkdir -p dist
cp -r apps/recruiter-dashboard/.output/public/* dist/
