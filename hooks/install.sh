#!/bin/bash
# Install git hooks for aryeh1.github.io

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_HOOKS_DIR="$(git rev-parse --git-dir)/hooks"

echo "Installing git hooks..."

# Make hooks executable
chmod +x "$SCRIPT_DIR/pre-commit"

# Create symlink
ln -sf "$SCRIPT_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit"

echo "Git hooks installed successfully!"
echo "Pre-commit hook will run: type check, lint, and tests"
