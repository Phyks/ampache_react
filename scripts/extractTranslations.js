import * as fs from 'fs';
import {sync as globSync} from 'glob';

const MESSAGES_PATTERN = './app/locales/messagesDescriptors/**/*.js';

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
let defaultMessages = globSync(MESSAGES_PATTERN)
    .map((filename) => require("../" + filename).default)
    .reduce((collection, descriptors) => {
        descriptors.forEach(({id, description, defaultMessage}) => {
            if (collection.hasOwnProperty(id)) {
                throw new Error(`Duplicate message id: ${id}`);
            }

            collection.push({
                id: id,
                description: description,
                defaultMessage: defaultMessage
            });
        });

        return collection;
    }, []);

// Sort by id
defaultMessages = defaultMessages.sort(function (item1, item2) {
    return item1.id.localeCompare(item2.id);
});

console.log("module.exports = {");
defaultMessages.forEach(function (item) {
    console.log("    " + JSON.stringify(item.id) + ": " + JSON.stringify(item.defaultMessage) + ",  // " + item.description);
});
console.log("};");
