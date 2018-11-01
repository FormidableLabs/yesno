Contributing
============

Thanks for contributing!

## Development

Install the project using `yarn` (which we've standardized on for development):

```sh
$ yarn install
```

`tl:dr` - You can run everything with:

```sh
$ yarn run compile
$ yarn run check
```

## Releasing a new version to NPM

_Only for project administrators_.

1. Update `HISTORY.md`, following format for previous versions
2. Commit as "History for version NUMBER"
3. Run `npm version patch` (or `minor|major|VERSION`) to run tests and lint,
   build published directories, then update `package.json` + add a git tag.
4. Run `npm publish` and publish to NPM if all is well.
5. Run `git push && git push --tags`
