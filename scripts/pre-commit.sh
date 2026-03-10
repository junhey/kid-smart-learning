#!/bin/bash
# Quality gate for local commits
# Install: ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit

set -e

echo "🔍 Running quality checks..."

echo "→ Linting..."
npm run lint

echo "→ Type checking..."
npx tsc --noEmit

echo "→ Unit tests..."
npm run test:unit

echo "→ Building..."
npm run build

echo "✅ All checks passed! Ready to commit."
