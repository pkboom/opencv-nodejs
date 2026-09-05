#!/usr/bin/env bash
#
# Release @pkboom/opencv-nodejs to npm.
#
# Bumps the version, pushes to master, and waits for the GitHub Actions
# workflow to build, test and publish. Publishing itself uses npm's trusted
# publisher (OIDC), so no token is involved.
#
#   ./deploy.sh              # patch: 1.0.4 -> 1.0.5
#   ./deploy.sh minor        # 1.0.4 -> 1.1.0
#   ./deploy.sh major        # 1.0.4 -> 2.0.0
#   ./deploy.sh 2.3.1        # exact version
#
set -euo pipefail

BUMP="${1:-patch}"
BRANCH="master"

die() { printf '\033[31merror:\033[0m %s\n' "$1" >&2; exit 1; }
say() { printf '\033[36m==>\033[0m %s\n' "$1"; }

cd "$(dirname "$0")"

command -v gh >/dev/null || die "gh (GitHub CLI) is not installed"
gh auth status >/dev/null 2>&1 || die "gh is not authenticated - run: gh auth login"

# A dirty tree would get swept into the release commit.
[ -z "$(git status --porcelain)" ] || die "working tree is not clean - commit or stash first"

current=$(git rev-parse --abbrev-ref HEAD)
[ "$current" = "$BRANCH" ] || die "on branch '$current', expected '$BRANCH'"

say "Fetching $BRANCH"
git pull --ff-only origin "$BRANCH"

old=$(node -p "require('./package.json').version")
name=$(node -p "require('./package.json').name")

say "Bumping version ($BUMP) from $old"
npm version "$BUMP" --no-git-tag-version >/dev/null
new=$(node -p "require('./package.json').version")

if npm view "$name@$new" version >/dev/null 2>&1; then
  git checkout -- package.json
  die "$name@$new is already on npm - pick a different version"
fi

say "$old -> $new"
git add package.json
git commit -q -m "$new"
git push -q origin "$BRANCH"
say "Pushed. Waiting for the publish workflow..."

# The push fires several workflows; find the publish one for this commit.
sha=$(git rev-parse HEAD)
run=""
for _ in $(seq 1 30); do
  run=$(gh run list --workflow npm-publish.yml --limit 10 \
        --json databaseId,headSha --jq \
        "[.[] | select(.headSha == \"$sha\")][0].databaseId" 2>/dev/null || true)
  [ -n "$run" ] && [ "$run" != "null" ] && break
  sleep 5
done
[ -n "$run" ] && [ "$run" != "null" ] || die "no workflow run appeared for $sha"

say "Watching run $run"
gh run watch "$run" --exit-status --interval 15 || die "workflow failed - see: gh run view $run --log-failed"

say "Waiting for npm to serve $new"
for _ in $(seq 1 60); do
  published=$(npm view "$name" version --prefer-online 2>/dev/null || true)
  [ "$published" = "$new" ] && break
  sleep 5
done
[ "${published:-}" = "$new" ] || die "workflow passed but npm still reports '${published:-unknown}'"

printf '\033[32mdone:\033[0m %s@%s is live\n' "$name" "$new"
