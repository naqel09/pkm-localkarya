#!/bin/bash

echo "Listing all users in the database..."

# Navigate to project root
cd "$(dirname "$0")"/..

# Run the TypeScript script with ts-node
npx ts-node -r tsconfig-paths/register src/scripts/list-users.ts

echo "User listing completed!"