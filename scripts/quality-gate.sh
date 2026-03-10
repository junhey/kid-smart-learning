#!/bin/bash
# Auto-iteration quality gate for cron job

set -e

echo "🔧 [$(date '+%H:%M:%S')] Running quality gate..."

# Layer 1: Type check
echo "→ Type checking..."
npx tsc --noEmit || {
  echo "❌ Type check failed!"
  exit 1
}

# Layer 2: Unit tests
echo "→ Unit tests..."
npm run test:unit || {
  echo "❌ Unit tests failed!"
  exit 1
}

# Layer 3: Build
echo "→ Building..."
npm run build || {
  echo "❌ Build failed! Rolling back..."
  git checkout HEAD -- .
  exit 1
}

# Layer 4: Critical files check
echo "→ Checking critical files..."
required_files=(
  "app/page.tsx"
  "app/english/page.tsx"
  "app/math/page.tsx"
  "hooks/useProgress.ts"
  "lib/gameUtils.ts"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Critical file missing: $file"
    git checkout HEAD -- .
    exit 1
  fi
done

echo "✅ All quality checks passed!"
