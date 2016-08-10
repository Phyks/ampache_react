/**
 * Collection of helper function that are Ampache specific.
 */

// NPM imports
import jsSHA from "jssha";


/**
 * Build an HMAC token for authentication against Ampache API.
 *
 * @param   password    User password to derive HMAC from.
 * @return  An object with the generated HMAC and time used.
 *
 * @remark  This builds an HMAC as expected by Ampache API, which is not a
 *          standard HMAC.
 */
export function buildHMAC (password) {
    const time = Math.floor(Date.now() / 1000);

    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(password);
    const key = shaObj.getHash("HEX");

    shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(time + key);

    return {
        time: time,
        passphrase: shaObj.getHash("HEX")
    };
}
