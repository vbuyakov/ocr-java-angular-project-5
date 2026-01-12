#!/bin/bash
set -euo pipefail

# Wrapper script to run generate_fake_data.py with virtual environment
# Usage: ./docker/tools/generate_fake_data.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VENV_DIR="${ROOT_DIR}/docker/tools/.venv"
SCRIPT="${ROOT_DIR}/docker/tools/generate_fake_data.py"

# Check if virtual environment exists
if [ ! -d "${VENV_DIR}" ]; then
    echo "Virtual environment not found. Running setup..."
    "${ROOT_DIR}/docker/tools/setup_venv.sh"
fi

# Activate virtual environment and run script
source "${VENV_DIR}/bin/activate"
python3 "${SCRIPT}"
