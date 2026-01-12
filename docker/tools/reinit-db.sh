#!/bin/bash
set -euo pipefail

# Script to reinitialize the database from dump.sql
# This will DELETE all existing data and reload from dump.sql
# Usage: ./docker/tools/reinit-db.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${ROOT_DIR}"

DUMP_FILE="${ROOT_DIR}/docker/dev-data/db/dump.sql"
VOLUME_NAME="mddapp_db_data"

echo "=========================================="
echo "Database Reinitialization Script"
echo "=========================================="
echo ""
echo "⚠️  WARNING: This will DELETE all existing database data!"
echo "The database will be reinitialized from: ${DUMP_FILE}"
echo ""

# Confirm action
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Aborted."
    exit 0
fi

echo "Step 1: Stopping all services..."
docker-compose down

echo ""
echo "Step 2: Removing database volume '${VOLUME_NAME}'..."
if docker volume inspect "${VOLUME_NAME}" >/dev/null 2>&1; then
    docker volume rm "${VOLUME_NAME}"
    echo "✓ Volume removed"
else
    echo "✓ Volume does not exist (already clean)"
fi

echo ""
echo "Step 3: Starting services (database will be initialized from dump.sql)..."
docker-compose up -d

echo ""
echo "Step 4: Waiting for database to be healthy..."
timeout=60
elapsed=0
while ! docker-compose ps db | grep -q "healthy"; do
    if [ $elapsed -ge $timeout ]; then
        echo "❌ Timeout waiting for database to become healthy"
        exit 1
    fi
    sleep 2
    elapsed=$((elapsed + 2))
    echo -n "."
done
echo ""

echo ""
echo "=========================================="
echo "✓ Database reinitialized successfully!"
echo "=========================================="
echo ""
echo "The database has been reinitialized from: ${DUMP_FILE}"
echo "All services are running."
