Contributing
============

## Building

See `README.md` for instructions on how to build. Build is done with
`webpack`.


## Useful scripts

A few `npm` scripts are provided:
* `npm run build` to trigger a dev build.
* `npm run watch` to trigger a dev build and rebuild on changes.
* `npm run prod` to trigger a production build.
* `npm run clean` to clean the `app/dist` folder.
* `npm run extractTranslations` to generate a translation file (see below).


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
