# Maintainers

This package is an npm metapackage for the Colony 2 package set. Publishing a new version updates the dependency bundle that users get from `npm install -g @colony2/c2`.

The package owns thin proxy bins for `c2r`, `c2m`, `c2j`, `jobdb`, and `shai`. npm does not reliably place dependency-owned bins on the global `PATH` when users globally install a dependency-only metapackage, so these proxy bins resolve and run the corresponding dependency package entrypoints.

## Release Automation

Every push to `main` or `master` runs `.github/workflows/release.yml`, except commits containing `[skip ci]`.

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

Initial setup used `[skip ci]` commits so the release workflow did not run before the npm trusted publisher was configured. Future normal commits to `main` or `master` should be released automatically by GitHub Actions.
