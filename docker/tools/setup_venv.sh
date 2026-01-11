#!/bin/bash
set -euo pipefail

# Setup script for Python virtual environment
# Usage: ./docker/tools/setup_venv.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VENV_DIR="${ROOT_DIR}/docker/tools/.venv"
REQUIREMENTS="${ROOT_DIR}/docker/tools/requirements.txt"

echo "Setting up Python virtual environment..."

# Create virtual environment if it doesn't exist
if [ ! -d "${VENV_DIR}" ]; then
    echo "Creating virtual environment at ${VENV_DIR}..."
    python3 -m venv "${VENV_DIR}"
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo ""
echo "Installing dependencies..."
source "${VENV_DIR}/bin/activate"
pip install --upgrade pip
pip install -r "${REQUIREMENTS}"

echo ""
echo "=========================================="
echo "✓ Setup complete!"
echo "=========================================="
echo ""
echo "To use the virtual environment, run:"
echo "  source docker/tools/.venv/bin/activate"
echo ""
echo "Or use the wrapper script:"
echo "  ./docker/tools/generate_fake_data.sh"
echo ""
