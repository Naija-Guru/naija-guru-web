/**
 * Adds a MutationObserver to the specified element to observe changes in its child elements or character data.
 *
 * @param {ObservableHTMLElement} el - The element to observe.
 * @param {function} callback - The callback function to execute when mutations are observed.
 */
export const addElObserver = (
  el: ObservableHTMLElement,
  callback: (el: HTMLElement) => void
) => {
  // Create a new MutationObserver instance
  const contentObserver = new MutationObserver((mutationsList) => {
    // Iterate through the list of mutations
    mutationsList.forEach((mutation) => {
      // If the mutation is of type 'childList' or 'characterData', execute the callback
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        callback(el);
      }
    });
  });

  // Configure the observer to watch for changes in child elements and character data
  contentObserver.observe(el, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Store the observer instance in the element's _observer property
  el._observer = contentObserver;
};

/**
 * Removes the MutationObserver from the specified element.
 *
 * @param {ObservableHTMLElement} el - The element whose observer should be removed.
 */
export const removeElObserver = (el: ObservableHTMLElement) => {
  // Disconnect the observer if it exists
  el._observer?.disconnect();
};
