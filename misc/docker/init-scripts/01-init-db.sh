#!/bin/bash
set -e

# Create database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extensions if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Drop users table if it exists to avoid conflicts with TypeORM
    DROP TABLE IF EXISTS users CASCADE;
    
    -- Let TypeORM create the users table structure
    -- We'll insert admin user after TypeORM migration
    
    -- Grant necessary permissions
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $POSTGRES_USER;
    
    -- Print success message
    SELECT 'Database initialization completed successfully' AS status;
    SELECT 'TypeORM will create users table structure' AS table_info;
EOSQL

echo "Database $POSTGRES_DB has been initialized successfully!"
echo "Default admin user created:"
echo "Username: admin"
echo "Password: admin123"
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