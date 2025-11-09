#!/bin/bash

echo "Updating admin password to 'nyaba123'..."

# Navigate to project root
cd "$(dirname "$0")"/..

# Run the TypeScript script with ts-node
npx ts-node -r tsconfig-paths/register src/scripts/update-admin-password.ts

echo "Password update process completed!"