Contributing
============

Thanks for contributing!

## Development

Install the project using `yarn` (which we've standardized on for development):

```sh
$ yarn install
```

You can build and run everything with:

```sh
$ yarn run compile
$ yarn run check
```

If you are actively developing, you can run a watch in one terminal:

```sh
$ yarn run watch
```

to build source files and then do whatever development you want in a separate terminal.

## Updating Generated typedoc

To update the generated typedoc, execute:

```sh
yarn run docs
```

## Releasing a new version to NPM

_Only for project administrators_.

1. Update `HISTORY.md`, following format for previous versions
2. Commit as "History for version NUMBER"
3. Run `npm version patch` (or `minor|major|VERSION`) to run tests and lint, regenerate docs,
   build published directories, then update `package.json` + add a git tag.
4. Run `npm publish` and publish to NPM if all is well.
5. Run `git push && git push --tags`
