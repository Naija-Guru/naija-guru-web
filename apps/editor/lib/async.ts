/**
 * A wrapper function to handle async operations with try-catch.
 *
 * @template T - The type of the resolved value of the promise.
 * @param {Promise<T>} promise - The promise to be resolved.
 * @returns {Promise<readonly [T | null, any | null]>} A promise that resolves to a tuple containing the data or an error.
 */
export async function asyncWrapper<T>(
  promise: Promise<T>
): Promise<readonly [T | null, any | null]> {
  try {
    // Await the promise and return the data with null error
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    // If an error occurs, return null data with the error
    return [null, error] as const;
  }
}
