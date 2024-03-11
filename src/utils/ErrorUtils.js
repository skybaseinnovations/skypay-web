// utils/errorUtils.js

/**
 * Safely gets errors for a given key from an errors object, where the key might contain dots.
 *
 * @param {Object} errors - The errors object to search within.
 * @param {String} key - The key to search for, potentially containing dots.
 * @return {Array} - An array of errors for the given key, or an empty array if none are found.
 */
export function getErrorsForKey(errors, key) {
	return key.split('.').reduce((acc, part) => acc && acc[part], errors) || [];
}
