/**
 * Collection of helper functions to deal with localization.
 */
import { i18nRecord } from "../models/i18n";

/**
 * Get the preferred locales from the browser, as an array sorted by preferences.
 */
export function getBrowserLocales () {
    let langs = [];

    if (navigator.languages) {
        // Chrome does not currently set navigator.language correctly
        // https://code.google.com/p/chromium/issues/detail?id=101138
        // but it does set the first element of navigator.languages correctly
        langs = navigator.languages;
    } else if (navigator.userLanguage) {
        // IE only
        langs = [navigator.userLanguage];
    } else {
        // as of this writing the latest version of firefox + safari set this correctly
        langs = [navigator.language];
    }

    // Some browsers does not return uppercase for second part
    let locales = langs.map(function (lang) {
        let locale = lang.split("-");
        return locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : lang;
    });

    return locales;
}


/**
 * Convert an array of messagesDescriptors to a map.
 */
export function messagesMap(messagesDescriptorsArray) {
    let messagesDescriptorsMap = {};

    messagesDescriptorsArray.forEach(function (item) {
        messagesDescriptorsMap[item.id] = item;
    });

    return messagesDescriptorsMap;
}


/**
 * Format an error message from the state.
 *
 * Error message can be either an i18nRecord, which is to be formatted, or a
 * raw string. This function performs the check and returns the correctly
 * formatted string.
 *
 * @param   errorMessage    The error message from the state, either plain
 *                          string or i18nRecord.
 * @param   formatMessage   react-i18n formatMessage.
 * @param   messages        List of messages to use for formatting.
 *
 * @return  A string for the error.
 */
export function handleErrorI18nObject(errorMessage, formatMessage, messages) {
    if (errorMessage instanceof i18nRecord) {
        // If it is an object, format it and return it
        return formatMessage(messages[errorMessage.id], errorMessage.values);
    }
    // Else, it's a string, just return it
    return errorMessage;
}
