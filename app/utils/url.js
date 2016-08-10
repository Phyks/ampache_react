/**
 * Collection of helper functions to deal with URLs.
 */


/**
 * Assemble a base URL and its GET parameters.
 *
 * @param   endpoint    Base URL.
 * @param   params      An object of GET params and their values.
 *
 * @return  A string with the full URL with GET params.
 */
export function assembleURLAndParams(endpoint, params) {
    let url = endpoint + "?";
    Object.keys(params).forEach(
        key => {
            if (Array.isArray(params[key])) {
                params[key].forEach(value => url += key + "[]=" + value + "&");
            } else {
                url += key + "=" + params[key] + "&";
            }
        }
    );
    return url.rstrip("&");
}


/**
 * Clean an endpoint URL.
 *
 * Adds the protocol prefix if not specified, remove trailing slash
 *
 * @param   An URL
 * @return  The cleaned URL
 */
export function cleanURL(endpoint) {
    if (
        !endpoint.startsWith("//") &&
            !endpoint.startsWith("http://") &&
        !endpoint.startsWith("https://"))
    {
        // Handle endpoints of the form "ampache.example.com"
        // Append same protocol as currently in use, to avoid mixed content.
        endpoint = window.location.protocol + "//" + endpoint;
    }

    // Remove trailing slash
    endpoint = endpoint.replace(/\/$/, "");

    return endpoint;
}
