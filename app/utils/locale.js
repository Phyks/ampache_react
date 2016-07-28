export function getBrowserLocale () {
    var lang;

    if (navigator.languages) {
        // chrome does not currently set navigator.language correctly https://code.google.com/p/chromium/issues/detail?id=101138
        // but it does set the first element of navigator.languages correctly
        lang = navigator.languages[0];
    } else if (navigator.userLanguage) {
        // IE only
        lang = navigator.userLanguage;
    } else {
        // as of this writing the latest version of firefox + safari set this correctly
        lang = navigator.language;
    }

    // Some browsers does not return uppercase for second part
    var locale = lang.split("-");
    locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : lang;

    return locale;
}

export function messagesMap(messagesDescriptorsArray) {
    var messagesDescriptorsMap = {};

    messagesDescriptorsArray.forEach(function (item) {
        messagesDescriptorsMap[item.id] = item;
    });

    return messagesDescriptorsMap;
}
