#!/usr/bin/env bash
# Release to npm. Bump the version and push; GitHub Actions publishes.
#   ./deploy.sh          # patch
#   ./deploy.sh minor
#   ./deploy.sh major
set -e

npm version "${1:-patch}"
git push --follow-tags
