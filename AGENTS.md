# Agent Instructions

- This project uses TanStack Start (SSR) with TanStack Router file-based routing.
- Routes are defined in `src/routes/`.
- Screen components live in `src/screens/`.
- Reusable components live in `src/components/`.
- Always run `npm run build` to validate changes before committing.
- The commit author must always be `lidierynascimento <160651070+lidierynascimento@users.noreply.github.com>` (repo `user.name`/`user.email` are set to this).
- Never commit under another author (e.g. the local machine user). If a commit was made with the wrong author, re-author it with `git commit --amend --author="lidierynascimento <160651070+lidierynascimento@users.noreply.github.com>"`.

## Branch and merge workflow

- `main` and `develop` are protected: direct pushes are blocked. Never push directly to `main` or `develop`; every change goes through a Pull Request.
- Always start (born) a new branch from `main` with its latest updates (`git checkout main`, `git fetch origin main`, `git pull`, then `git checkout -b <branch>`).
- Merge order is always `feature branch -> develop`, and only after that `develop -> main`. Never merge a feature branch straight into `main`.
- Open a Pull Request for each step and merge via the PR (no direct merge, no force-push). Keep `main` and `develop` in sync by promoting `develop` into `main`.
- Branch naming: `feature/<assunto>` for features, `fix/<assunto>` for fixes.
