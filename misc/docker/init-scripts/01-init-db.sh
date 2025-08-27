#!/bin/bash
set -e

# Create database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extensions if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Create indexes for better performance (will be created by TypeORM)
    -- These are just examples, actual indexes will be handled by TypeORM
    
    -- Grant necessary permissions
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
    
    -- Print success message
    SELECT 'Database initialization completed successfully' AS status;
EOSQL

echo "Database $POSTGRES_DB has been initialized successfully!"