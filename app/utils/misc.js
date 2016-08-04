/**
 * Strict int checking function.
 *
 * @param   value   The value to check for int.
 */
export function filterInt (value) {
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
        return Number(value);
    }
    return NaN;
}

/**
 * Helper to format song length.
 *
 * @param   time    Length of the song in seconds.
 * @return  Formatted length as MM:SS.
 */
export function formatLength (time) {
    const min = Math.floor(time / 60);
    let sec = (time - 60 * min);
    if (sec < 10) {
        sec = "0" + sec;
    }
    return  min + ":" + sec;
}
