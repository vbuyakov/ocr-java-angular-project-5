#!/bin/bash
set -euo pipefail

# Script to reload database from dump.sql
# Usage: ./docker/tools/reload-db.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${ROOT_DIR}"

# Load environment variables
set -a
# shellcheck disable=SC1090
if [ -f .env ]; then
  source .env
fi
set +a

DUMP_FILE="${ROOT_DIR}/docker/dev-data/db/dump.sql"
DB_CONTAINER="mdd-db"
DB_NAME="${MYSQL_DATABASE:-mddapp}"
DB_USER="${MYSQL_USER:-mdduser}"
DB_PASSWORD="${MYSQL_PASSWORD:-mddpassword}"

echo "Reloading database from ${DUMP_FILE}..."

# Check if container is running
if ! docker ps | grep -q "${DB_CONTAINER}"; then
  echo "Error: Database container '${DB_CONTAINER}' is not running"
  echo "Start it with: docker-compose up -d db"
  exit 1
fi

# Import the dump
echo "Importing dump.sql..."
docker exec -i "${DB_CONTAINER}" mysql -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < "${DUMP_FILE}"

echo "Database reloaded successfully!"
