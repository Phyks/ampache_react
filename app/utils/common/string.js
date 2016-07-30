/**
 * Capitalize function on strings.
 */
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Strip characters at the end of a string.
 *
 * @param   chars   A regex-like element to strip from the end.
 */
String.prototype.rstrip = function (chars) {
    var regex = new RegExp(chars + "$");
    return this.replace(regex, "");
};
