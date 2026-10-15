# Agent Instructions

- This project uses TanStack Start (SSR) with TanStack Router file-based routing.
- Routes are defined in `src/routes/`.
- Screen components live in `src/screens/`.
- Reusable components live in `src/components/`.
- Always run `npm run build` to validate changes before committing.
- When creating a new branch, always start from `main` with its latest updates (`git checkout main`, `git pull`/`git fetch origin main`, then branch from it).
- The commit author must always be `lidierynascimento <160651070+lidierynascimento@users.noreply.github.com>` (repo `user.name`/`user.email` are set to this).
- Never commit under another author (e.g. the local machine user). If a commit was made with the wrong author, re-author it with `git commit --amend --author="lidierynascimento <160651070+lidierynascimento@users.noreply.github.com>"`.
- Every change must land on `develop` first and then be propagated to `main`, keeping both branches in sync (`git branch -f develop main` or a merge), and both must be pushed to `origin`.
