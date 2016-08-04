export function assembleURLAndParams (endpoint, params) {
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
