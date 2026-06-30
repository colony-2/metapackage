# @colony/c2

Metapackage for installing the Colony C2 package set:

- `@colony2/c2r`
- `@colony2/c2m`
- `@colony2/c2j`
- `@colony2/jobdb`
- `@colony2/shai`

## Install

```sh
npm install @colony/c2
```

This package is dependency-only and does not expose a runtime entrypoint.

## Releases

Every push to `main` or `master` runs `.github/workflows/release.yml`.

The workflow:

1. bumps the patch version in `package.json`
2. commits the version bump with `[skip ci]`
3. tags the commit as `vX.Y.Z`
4. publishes the package to npm
5. creates a GitHub release from the tag

Publishing uses npm Trusted Publishing over GitHub Actions OIDC. No `NPM_TOKEN` secret is required.

## First setup

The first GitHub push should skip the release workflow because the npm package and trusted publisher connection do not exist yet:

```sh
git init
git branch -M main
git add .
git commit -m "chore: initial package [skip ci]"
git remote add origin git@github.com:OWNER/REPO.git
git push -u origin main
```

Publish the first package version locally:

```sh
npm login
npm publish --access public
```

Then configure npm Trusted Publishing for `@colony/c2`:

- publisher: GitHub Actions
- organization or user: your GitHub owner
- repository: your GitHub repository name
- workflow filename: `release.yml`
- allowed action: `npm publish`

Before the first automated release, set `repository` in `package.json` to the same public GitHub repository used for Trusted Publishing.

After that, each normal commit pushed to `main` or `master` will publish through GitHub Actions without any npm token in GitHub.
