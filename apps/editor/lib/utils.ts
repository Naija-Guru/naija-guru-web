/**
 * Creates a debounced function that delays invoking the provided function until after the specified delay.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A new debounced function.
 */
export function debounce(func: Function, delay: number) {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: any) => {
    // Clear the previous timeout
    clearTimeout(timeout);

    // Set a new timeout to invoke the function after the delay
    timeout = setTimeout(() => func(...args), delay);
  };
}
