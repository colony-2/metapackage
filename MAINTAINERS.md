# Maintainers

This package is an npm metapackage for the Colony 2 package set. Publishing a new version updates the dependency bundle that users get from `npm install -g @colony2/c2`.

The package owns thin proxy bins for `c2r`, `c2m`, `c2j`, `jobdb`, and `shai`. npm does not reliably place dependency-owned bins on the global `PATH` when users globally install a dependency-only metapackage, so these proxy bins resolve and run the corresponding dependency package entrypoints.

Dependencies are pinned to exact versions. That makes each metapackage release a reproducible bundle and gives automation a concrete value to update when one of the underlying packages publishes a new version.

## Dependency Updates

`.github/workflows/update-dependencies.yml` runs hourly and can also be run manually.

The dependency update workflow:

1. runs `scripts/update-dependencies.mjs`
2. checks the latest npm version of each bundled package
3. updates `package.json` when any pinned dependency version is stale
4. commits the dependency version changes
5. dispatches `.github/workflows/release.yml`

The explicit workflow dispatch is intentional. GitHub does not run normal `push` workflows for commits pushed by a workflow using `GITHUB_TOKEN`, so the updater cannot rely on its dependency-update commit automatically triggering the release workflow.

## Release Automation

Human pushes to `main` or `master` run `.github/workflows/release.yml`, except commits containing `[skip ci]`. The release workflow can also be run manually or dispatched by the dependency update workflow.

The release workflow:

1. bumps the patch version in `package.json`
2. commits the version bump with `[skip ci]`
3. tags the commit as `vX.Y.Z`
4. verifies the npm package contents with `npm pack --dry-run`
5. pushes the version commit and tag
6. publishes the package to npm
7. creates a GitHub release from the tag

Publishing uses npm Trusted Publishing over GitHub Actions OIDC. No npm token should be stored in GitHub.

The trusted publisher configuration on npm should match:

- package: `@colony2/c2`
- publisher: GitHub Actions
- organization or user: `colony-2`
- repository: `metapackage`
- workflow filename: `release.yml`
- allowed action: `npm publish`

The package repository metadata in `package.json` must continue to point to `https://github.com/colony-2/metapackage` so npm provenance matches the trusted GitHub workflow identity.

## First Publish

The first package version was published locally because npm Trusted Publishing can only be configured after the npm package exists.

Initial setup used `[skip ci]` commits so the release workflow did not run before the npm trusted publisher was configured. Future normal human commits to `main` or `master` should be released automatically by GitHub Actions.
