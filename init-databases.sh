#!/bin/bash
# PostgreSQL multi-database initialization script

set -e

# Create databases and users for each service
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Novu database
    CREATE DATABASE novu;
    CREATE USER novu WITH ENCRYPTED PASSWORD 'novu-password';
    GRANT ALL PRIVILEGES ON DATABASE novu TO novu;

    -- Listmonk database
    CREATE DATABASE listmonk;
    CREATE USER listmonk WITH ENCRYPTED PASSWORD 'listmonk-password';
    GRANT ALL PRIVILEGES ON DATABASE listmonk TO listmonk;

    -- Twenty CRM database
    CREATE DATABASE twenty;
    CREATE USER twenty WITH ENCRYPTED PASSWORD 'twenty-password';
    GRANT ALL PRIVILEGES ON DATABASE twenty TO twenty;

    -- Postal database
    CREATE DATABASE postal;
    CREATE USER postal WITH ENCRYPTED PASSWORD 'postal-password';
    GRANT ALL PRIVILEGES ON DATABASE postal TO postal;
EOSQL

echo "All databases created successfully"