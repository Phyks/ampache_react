import { i18nRecord } from "../models/i18n";

export function getBrowserLocales () {
    let langs;

    if (navigator.languages) {
        // chrome does not currently set navigator.language correctly https://code.google.com/p/chromium/issues/detail?id=101138
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

export function messagesMap(messagesDescriptorsArray) {
    let messagesDescriptorsMap = {};

    messagesDescriptorsArray.forEach(function (item) {
        messagesDescriptorsMap[item.id] = item;
    });

    return messagesDescriptorsMap;
}


export function handleErrorI18nObject(errorMessage, formatMessage, messages) {
    if (errorMessage instanceof i18nRecord) {
        return formatMessage(messages[errorMessage.id], errorMessage.values);
    }
    return errorMessage;
}
