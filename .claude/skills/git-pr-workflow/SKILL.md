---

name: git-pr-workflow
description: Use this skill when the user starts, finishes, merges, cleans up, or asks about a Git task that must go through dev, CI, and pull requests. This skill enforces the correct local and remote workflow: feature branch locally, push feature branch to GitHub, open PR into dev, merge on GitHub, then clean up branches.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Git PR Workflow Skill

## Purpose

This skill enforces a clean Git workflow for the project.

The correct workflow is:

```text
feature/* or fix/* → push to GitHub → pull request → dev → pull request → main
```

Direct commits and direct pushes to `main` are forbidden.

Direct commits and direct pushes to `dev` must be avoided.

Local merge into `dev` must not be used for normal development, because it bypasses pull requests and CI review.

## Branch Model

Use these branches:

```text
main              stable production/release branch
dev               integration branch for development
feature/<name>    new functionality or UI changes
fix/<name>        bug fixes
chore/<name>      tooling, config, dependencies, cleanup
refactor/<name>   refactoring without behavior changes
ci/<name>         CI/CD changes
docs/<name>       documentation changes
```

Normal task flow:

```text
feature/<name> → PR → dev
```

Release flow:

```text
dev → PR → main
```

## Core Rule

Never recommend this workflow for normal tasks:

```bash
git checkout dev
git merge feature/example
git push origin dev
```

This is wrong for the project because it bypasses the GitHub pull request process.

Instead, always recommend:

```bash
git push -u origin feature/example
```

Then open a pull request:

```text
base: dev
compare: feature/example
```

## Starting a New Task

When the user starts a new task, first classify the task:

```text
feature  new behavior, UI redesign, new page, new capability
fix      bug fix or broken behavior
chore    config, tooling, dependencies, cleanup
refactor internal code restructuring without behavior change
ci       GitHub Actions, CI/CD, branch protection
docs     documentation
```

Then suggest one branch name.

Examples:

```text
Redesign booking grid → feature/booking-grid-redesign
Add horizontal scroll to booking grid → feature/booking-grid-scroll
Fix room image paths → fix/room-image-paths
Configure GitHub Actions → ci/github-actions
Update README → docs/readme-workflow
Split large booking component → refactor/booking-components
```

Then provide commands:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/example-name
```

Do not create feature branches from `main` unless the user is doing a production hotfix.

## Working Locally

While the user works locally, commits stay in the feature branch.

Valid local flow:

```bash
git status
git add .
git commit -m "feat: short description"
```

Additional commits for the same open task go into the same feature branch:

```bash
git add .
git commit -m "fix: correct booking grid spacing"
```

Do not switch to `dev` and merge locally.

## Commit Style

Use Conventional Commits.

Valid examples:

```text
feat: redesign booking grid
fix: correct room image paths
chore: update dependencies
docs: add git workflow notes
refactor: split booking grid component
style: adjust booking grid layout
test: add booking date tests
ci: add github actions workflow
build: update vite config
```

When the user asks for a commit message, provide one short Conventional Commit message.

## No AI Attribution in Commits or Project Files

Never add AI attribution to Git commits, pull requests, documentation, or project files unless the user explicitly asks for it.

Do not add any of these trailers or similar attribution lines:

```text
Co-Authored-By: Claude...
Co-Authored-By: Anthropic...
Generated-By: Claude...
Generated-By: AI...
Signed-off-by: Claude...
```

Do not mention Claude, Anthropic, AI assistant, or generated-by metadata in:

```text
commit messages
PR titles
PR bodies
README.md
CONTRIBUTING.md
CLAUDE.md
source code comments
documentation files
```

Commit messages must stay clean and use only Conventional Commits.

Correct:

```bash
git commit -m "chore: add git workflow tooling"
```

Incorrect:

```bash
git commit -m "$(cat <<'EOF'
chore: add git workflow tooling

Co-Authored-By: Claude Sonnet <noreply@anthropic.com>
EOF
)"
```

Before running `git commit`, check the prepared commit command. If it contains `Co-Authored-By`, `Generated-By`, `Signed-off-by`, or any Claude/AI attribution, remove it.

If a commit was already created with AI attribution but has not been pushed, fix it with:

```bash
git commit --amend -m "chore: add git workflow tooling"
```

If the commit was already pushed, do not rewrite history automatically. Ask the user before using:

```bash
git push --force-with-lease
```

Default rule:

```text
No AI attribution unless explicitly requested by the user.
```


## Before Push

Before pushing a branch, suggest relevant checks based on the real project stack.

Do not assume the project is frontend-only. First inspect the project files and available scripts.

### Frontend projects

For frontend projects, prefer:

```bash
npm run typecheck --if-present
npm run lint --if-present
npm test --if-present
npm run build
```

If the project uses another package manager, adapt the commands:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

or:

```bash
yarn typecheck
yarn lint
yarn test
yarn build
```

### Backend projects

For Node.js backend projects, prefer:

```bash
npm run typecheck --if-present
npm run lint --if-present
npm test --if-present
npm run build --if-present
```

For .NET backend projects, prefer:

```bash
dotnet restore
dotnet build
dotnet test
```

For Go backend projects, prefer:

```bash
gofmt -w .
go vet ./...
go test ./...
go build ./...
```

For Python backend projects, prefer checks that already exist in the project:

```bash
python -m pytest
python -m ruff check .
python -m mypy .
```

If the project uses Poetry:

```bash
poetry run pytest
poetry run ruff check .
poetry run mypy .
```

If the project uses uv:

```bash
uv run pytest
uv run ruff check .
uv run mypy .
```

For Java backend projects, use the project wrapper if present.

Maven:

```bash
./mvnw test
./mvnw package
```

Gradle:

```bash
./gradlew test
./gradlew build
```

### MAX bot projects

For MAX bot projects, first determine the implementation stack.

The assistant must check:

```bash
git status
ls
```

Then inspect relevant files:

```text
package.json
pyproject.toml
requirements.txt
go.mod
*.csproj
.env.example
README.md
```

For Node.js MAX bots, prefer:

```bash
npm run typecheck --if-present
npm run lint --if-present
npm test --if-present
npm run build --if-present
```

For Python MAX bots, prefer:

```bash
python -m pytest
python -m ruff check .
```

For Go MAX bots, prefer:

```bash
gofmt -w .
go vet ./...
go test ./...
go build ./...
```

For .NET MAX bots, prefer:

```bash
dotnet restore
dotnet build
dotnet test
```

Before pushing a MAX bot branch, additionally verify that no secrets are staged:

```bash
git diff --cached --name-only
git diff --cached
```

The assistant must not commit:

```text
.env
.env.local
bot tokens
API tokens
access tokens
private keys
real webhook secrets
production credentials
```

If the bot requires environment variables, commit only safe examples:

```text
.env.example
README setup instructions
```

Do not run the real bot against production services unless the user explicitly asks.

### General rule

If a check command does not exist, do not invent a broken command. Inspect the project configuration first, then suggest the smallest reliable check set.

Before pushing, always suggest:

```bash
git status
git diff --cached --name-only
```

Then push only when the working tree and staged files match the current task.


## Pushing the Feature Branch

After local commits are ready, push the feature branch to GitHub:

```bash
git push -u origin feature/example-name
```

Then tell the user to create a pull request:

```text
base: dev
compare: feature/example-name
```

For normal development, the PR must target `dev`, not `main`.

## Creating Pull Requests with GitHub CLI

The user has GitHub CLI (`gh`) installed and authenticated.

After the feature branch is pushed to GitHub, the assistant should create a pull request automatically using `gh pr create`.

Before creating the PR, verify the current branch:

```bash
git branch --show-current
```

Then push the current feature branch:

```bash
git push -u origin feature/example-name
```

Then create a pull request into `dev`:

```bash
gh pr create \
  --base dev \
  --head feature/example-name \
  --title "feat: short PR title" \
  --body-file .github/PULL_REQUEST_TEMPLATE.md
```

If `.github/PULL_REQUEST_TEMPLATE.md` is too generic or contains unchecked placeholders, create a concise PR body manually instead:

```bash
gh pr create \
  --base dev \
  --head feature/example-name \
  --title "feat: short PR title" \
  --body "## Summary
- Implemented the requested change.
- Kept the PR scoped to the current task.

## Checks
- [ ] Build passes
- [ ] Typecheck passes
- [ ] Lint passes, if configured
- [ ] Tests pass, if configured
- [ ] UI checked manually, if UI was changed
- [ ] No unrelated files changed
- [ ] No secrets or local config committed"
```

For normal development, always use:

```text
base: dev
head: current feature/fix/chore/refactor branch
```

Do not create normal feature PRs directly into `main`.

For release PRs, use:

```bash
gh pr create \
  --base main \
  --head dev \
  --title "chore: release dev to main" \
  --body "## Summary
- Release current dev changes into main.

## Checks
- [ ] CI is green
- [ ] Build passes
- [ ] Release behavior checked
- [ ] No temporary/debug code remains"
```

After creating a PR, show the PR URL returned by `gh`.

Do not merge the PR automatically unless the user explicitly asks for it.

The assistant may check PR status with:

```bash
gh pr status
```

The assistant may inspect checks with:

```bash
gh pr checks
```

The assistant may open the PR in the browser with:

```bash
gh pr view --web
```

If `gh pr create` fails because the branch was not pushed, push the branch first and retry.

If `gh pr create` fails because a PR already exists, do not create another PR. Show the existing PR using:

```bash
gh pr view --web
```

## Updating an Open PR

If the PR is still open and the user needs to make more changes, continue using the same branch:

```bash
git checkout feature/example-name
git add .
git commit -m "fix: address review comments"
git push
```

The existing PR will update automatically.

Do not create a new branch for review fixes while the original PR is still open.

## After PR Merge into dev

After the PR is merged on GitHub, clean up the local branch.

First update local `dev`:

```bash
git checkout dev
git pull origin dev
```

Then delete the local feature branch:

```bash
git branch -d feature/example-name
```

Then delete the remote feature branch if GitHub did not delete it automatically:

```bash
git push origin --delete feature/example-name
```

If Git says the branch is not fully merged, do not immediately suggest force deletion.

Explain:

```text
git branch -D feature/example-name
```

is force deletion and should only be used if the user is sure the branch was already merged or is no longer needed.

## If the User Already Merged Locally

If the user says they created a branch locally, committed, merged into local `dev`, deleted the branch, and then wants to push, explain that this would become a direct push to `dev`.

Say that this bypasses PR and CI review.

Correct recovery options:

### Option A: If the user has not pushed dev yet

Create a new branch from the current local `dev` state and push that branch for PR.

```bash
git checkout dev
git checkout -b feature/recovered-changes
git push -u origin feature/recovered-changes
```

Then reset local `dev` back to remote `dev`:

```bash
git checkout dev
git fetch origin
git reset --hard origin/dev
```

Then open PR:

```text
base: dev
compare: feature/recovered-changes
```

### Option B: If the user already pushed directly to dev

Explain that the PR was bypassed.

Then recommend not repeating this pattern and continue with the next task using the correct feature branch workflow.

Do not suggest rewriting shared history unless the user explicitly asks and understands the risk.

## Release from dev to main

When the user is ready to release stable changes:

```text
dev → PR → main
```

Before merging into `main`, check:

```text
CI is green
build passes
typecheck passes
lint passes, if configured
manual UI check is complete, if UI changed
no debug files remain
no secrets are committed
PR base is main
PR compare is dev
```

Do not suggest pushing `dev` directly into `main`.

## Pull Request Checklist

When preparing a PR, include this checklist:

```text
- [ ] Build passes
- [ ] Typecheck passes
- [ ] Lint passes, if configured
- [ ] Tests pass, if configured
- [ ] UI checked manually, if UI was changed
- [ ] No unrelated files changed
- [ ] No secrets or local config committed
- [ ] PR targets dev, not main
```

For release PRs:

```text
- [ ] PR is dev → main
- [ ] CI is green
- [ ] Release behavior checked
- [ ] No temporary/debug code remains
```

## Branch Cleanup Rules

A feature branch is temporary.

Use it for one task and one PR.

After merge, delete it.

Correct:

```text
one task = one branch = one PR = delete branch after merge
```

Incorrect:

```text
reuse old feature branch for future unrelated changes
```

If future work touches the same area, create a new branch from fresh `dev`.

Example:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/booking-grid-tooltips
```

## Response Style

Be concise.

Give exact commands.

Prefer one recommended branch name instead of multiple options.

When the user asks what to do next, infer the current Git step and provide the next command.

When the user is about to bypass PR, explicitly stop that path and give the correct alternative.

Never suggest force push, hard reset, or force delete unless there is a clear reason and the risk is explained.
