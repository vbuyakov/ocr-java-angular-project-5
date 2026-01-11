#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

set -a
# shellcheck disable=SC1090
source "${ROOT_DIR}/.env"
set +a

OUTPUT_FILE="${ROOT_DIR}/docker/dev-data/db/dump.sql"
SCHEMA_TMP="$(mktemp)"

# Dump structure and topics table data

mysqldump -u "${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -h 127.0.0.1 -P 3306 \
  --no-data --no-tablespaces --set-gtid-purged=OFF --single-transaction \
  "${MYSQL_DATABASE}" > "${SCHEMA_TMP}"

# Remove AUTO_INCREMENT only from schema; data dump keeps topic IDs intact.
sed -E 's/ AUTO_INCREMENT=[0-9]+//g' "${SCHEMA_TMP}" > "${OUTPUT_FILE}"

mysqldump -u "${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -h 127.0.0.1 -P 3306 \
  --no-create-info --no-tablespaces --set-gtid-purged=OFF --single-transaction \
  "${MYSQL_DATABASE}" topics >> "${OUTPUT_FILE}"

rm -f "${SCHEMA_TMP}"
