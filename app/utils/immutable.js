/**
 * Collection of helper function to act on Immutable objects.
 */


/**
 * Diff two immutables objects supporting the filter method.
 *
 * @param   a   First Immutable object.
 * @param   b   Second Immutable object.
 * @returns     An Immutable object equal to a except for the items in b.
 */
export function immutableDiff (a, b) {
    return a.filter(function (i) {
        return b.indexOf(i) < 0;
    });
}
