Ampache React
=============

This is an alternative web interface for
[Ampache](https://github.com/ampache/ampache/) built using Ampache XML API and
React.

## Trying it out

Just drop this repo in a location served by a webserver, make your webserver
serve the `public` folder and head your browser to the correct URL :)

Or you can use the [hosted version](https://phyks.github.io/ampache_react/).


## Requirements

To use this interface, you need:
* An Ampache server on which you have an account, serving the [XML
  API](https://github.com/ampache/ampache/wiki/XML-API). Ensures your server
  has correct [CORS header](https://www.w3.org/wiki/CORS_Enabled) set.
* A modern browser.

For now, this is a work in progress and as such, the [hosted
version](https://phyks.github.io/ampache_react/) (or `gh-pages` branch) always
require the latest `develop` branch of Ampache. As soon as this is stabilized
and Ampache gets a new version, this note will be updated with the required
Ampache version.

Note that `master` branch may differ from `gh-pages` branch from time to time,
and `master` branch may rely on commits that are not yet in Ampache `develop`
branch. `gh-pages` branch is ensured to be working with latest Ampache
`develop` branch.

## Support

The supported browsers should be:

* `IE >= 9` (previous versions of IE are no longer supported by Microsoft)
* Any last three versions of major browsers (> 1% net share).
* No support provided for Opera Mini.

If you experience any issue, please report :)


## Building

Building of this app relies on `webpack`.

First do a `npm install` to install all the required dependencies.

Then, to make a development build, just run `webpack` in the root folder. To
make a production build, just run `NODE_ENV=production webpack` in the root
folder. All files will be generated in the `public` folder.

Please use the Git hooks (in `hooks` folder) to automatically make a build
before comitting, as commit should always contain an up to date production
build.

Compilation cache is stored in `.cache` at the root of this repo. Remember to
clean it in case of compilation issues.


## Contributing

See `CONTRIBUTING.md` file for extra infos.


## License

This code is distributed under an MIT license.

Feel free to contribute and reuse. For more details, see `LICENSE` file.
