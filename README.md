Ampache React
=============

This is an alternative web interface for
[Ampache](https://github.com/ampache/ampache/) built using Ampache XML API and
React.

## Trying it out

Just drop this repo in a location served by a webserver and head your browser
to the correct URL :)


## Support

The supported browsers should be:

* `IE >= 9` (previous versions of IE are no longer supported by Microsoft)
* Any recent version of any other browser.

If you experience any issue, please report :)


## Building

Building of this app relies on `webpack`.

First do a `npm install` to install all the required dependencies.

Then, to make a development build, just run `webpack` in the root folder. To
make a production build, just run `NODE_ENV=production webpack` in the root
folder. All files will be generated in the `app/dist` folder.

Please use the Git hooks (in `hooks` folder) to automatically make a build
before comitting, as commit should always contain an up to date production
build.

## License

This code is distributed under an MIT license.

Feel free to contribute and reuse. For more details, see `LICENSE` file.
