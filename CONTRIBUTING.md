Contributing
============

## Building

See `README.md` for instructions on how to build. Build is done with
`webpack`.


## Useful scripts

A few `npm` scripts are provided:
* `npm run build:dev` to trigger a dev build.
* `npm run build:prod` to trigger a production build.
* `npm run watch:dev` to trigger a dev build and rebuild on changes.
* `npm run watch:prod` to trigger a production build and rebuild on changes.
* `npm run clean` to clean the `public` folder.
* `npm run extractTranslations` to generate a translation file (see below).
* `npm run lint:scss` and `npm run lint:js` for linting utilities.
* `npm run test` which calls all the lint stuff.


## Translating

Translations are handled by [react-intl](https://github.com/yahoo/react-intl/).

`npm run --silent extractTranslations` output a file containing all the english
translations, in the expected form. It is a mapping of ids and strings to
translate, with an extra description provided as a comment at the end of the
line, for some translation context.

Typically, if you want to translate to another `$LOCALE` (say `fr-FR`), create
a folder `./app/locales/$LOCALE`, put inside the generated file from `npm run
--silent extractTranslations`, called `index.js`. Copy the lines in
`./app/locales/index.js` to include your new translation and translate all the
strings in the `./app/locales/$LOCALE/index.js` file you have just created.


## Coding style

No strict coding style is used in this repo. ESLint and Stylelint, ran with
`npm run test` ensures a certain coding style. Try to keep the coding style
homogeneous.


## Hooks

Usefuls Git hooks are located in `hooks` folder.


## Notes on URLs

Text after any dash in a URL parameter is considered as a comment and
discarded. In `/artist/1-foobar`, the artist ID is `1` and the `foobar` text
is simply considered as a comment for human readable URLs.
