#!/bin/bash

echo "Checking password hash for user esa.fauzi..."

# Navigate to project root
cd "$(dirname "$0")"/..

# Run the TypeScript script with ts-node
npx ts-node -r tsconfig-paths/register src/scripts/check-user-password.ts

echo "Password check completed!"