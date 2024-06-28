/**
 * Limits the number of decimal places if necessary, otherwise keeps the decimals as they are.
 * @param {number} value - The number to format.
 * @param {number} maxDecimals - The maximum number of decimal places.
 * @returns {string} - The formatted number as a string.
 */
export function limitDecimals(value, maxDecimals) {
  const [integerPart, decimalPart] = value.toString().split(".");

  // If there's no decimal part or its length is within the limit, return the value as is
  if (!decimalPart || decimalPart.length <= maxDecimals) {
    return value.toString();
  }

  // Otherwise, limit the decimal part to the specified number of digits
  return `${integerPart}.${decimalPart.slice(0, maxDecimals)}`;
}
