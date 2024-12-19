import { TSuggestion, TSuggestionCoordinates } from '@/models/suggestion';
import {
  ELEMENT_DATA_ATTRIBUTE_ID,
  HIGHLIGHT_DATA_ATTRIBUTE_ID,
} from '../constants';
import { replaceTextWithSuggestion } from './string';

/**
 * Retrieves all text nodes within a given HTML element.
 *
 * @param {HTMLElement} el - The HTML element to retrieve text nodes from.
 * @returns {Node[]} An array of text nodes.
 */
export const getTextNodes = (el: HTMLElement): Node[] => {
  const nodes: Node[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  const filteredNodes = nodes.filter((node) =>
    Boolean(node.textContent?.length)
  );

  return filteredNodes;
};

/**
 * Gets the end indexes of the provided text nodes.
 *
 * @param {Node[]} textNodes - The list of text nodes.
 * @returns {number[]} An array of end indexes for the text nodes.
 */
export const getTextNodesEndIndexes = (textNodes: Node[]): number[] => {
  return textNodes.reduce((acc, node) => {
    const lastIndex = acc.length ? acc[acc.length - 1] : -1;
    const endIndex = lastIndex + node.textContent!.length;
    acc.push(endIndex);
    return acc;
  }, [] as number[]);
};

/**
 * Checks if a point (x, y) is within the visible part of an HTML element.
 *
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @param {HTMLElement} element - The HTML element to check against.
 * @returns {boolean} True if the point is within the visible part of the element, otherwise false.
 */
export function isPointInVisiblePartOfElement(
  x: number,
  y: number,
  element: HTMLElement
): boolean {
  // Get the bounding rectangle of the element
  const rect = element.getBoundingClientRect();

  // Check if the point is within the element's bounding rectangle
  const isWithinElement =
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

  if (!isWithinElement) {
    // If the point is not within the element's bounding box, it's not in the visible part
    return false;
  }

  // Check if the element has an ancestor that clips overflow (like a scrolling container)
  let parent = element.parentElement;

  while (parent) {
    const parentRect = parent.getBoundingClientRect();
    const overflow = window.getComputedStyle(parent).overflow;

    if (overflow === 'hidden' || overflow === 'scroll' || overflow === 'auto') {
      // Check if the point is within the visible area of this parent
      const isWithinParent =
        x >= parentRect.left &&
        x <= parentRect.right &&
        y >= parentRect.top &&
        y <= parentRect.bottom;

      if (!isWithinParent) {
        // If the point lies outside the visible area of this parent, it's not in the visible part
        return false;
      }
    }

    parent = parent.parentElement;
  }

  // If no clipping ancestors restrict the point, it's in a visible part
  return true;
}

/**
 * Draws highlights for element suggestions on a canvas.
 *
 * @param {string} elementId - The ID of the element to highlight.
 * @param {TSuggestion[]} suggestions - The list of suggestions to highlight.
 */
export const drawHighlightsForElementSuggestions = (
  elementId: string,
  suggestions: TSuggestion[]
) => {
  const target = getTargetElementById(elementId);

  if (!target) return;

  const canvas = getOrCreateHighlightCanvas(elementId);

  if (!canvas) return;

  clearCanvas(canvas);

  const ctx = canvas.getContext('2d');
  const suggestionsCoordinates = getSuggestionsCoordinates(suggestions, target);

  mirrorDivElWithCanvas(target, canvas);

  const targetElRect = target.getBoundingClientRect();
  suggestionsCoordinates.forEach((coordinates) => {
    if (
      ctx &&
      isPointInVisiblePartOfElement(
        coordinates.left,
        coordinates.top + coordinates.height,
        target
      )
    ) {
      drawSuggestionRect(ctx, coordinates, targetElRect);
    }
  });
};

/**
 * Draws a suggestion rectangle on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {TSuggestionCoordinates} coordinates - The coordinates of the suggestion.
 * @param {DOMRect} targetElRect - The bounding rectangle of the target element.
 */
export const drawSuggestionRect = (
  ctx: CanvasRenderingContext2D,
  coordinates: TSuggestionCoordinates,
  targetElRect: DOMRect
) => {
  ctx.fillStyle = 'red';
  ctx.fillRect(
    coordinates.left - targetElRect.x,
    coordinates.top + coordinates.height - 1 - targetElRect.y,
    coordinates.width,
    3
  );
};

/**
 * Gets or creates a highlight canvas for the target element.
 *
 * @param {HTMLDivElement} target - The target element.
 * @param {string} elementId - The ID of the element.
 * @returns {HTMLCanvasElement} The highlight canvas.
 */
export const getOrCreateHighlightCanvas = (
  elementId: string
): HTMLCanvasElement | null => {
  const target = getTargetElementById(elementId);

  if (!target) {
    return null;
  }

  let canvas: HTMLCanvasElement | null =
    document.querySelector<HTMLCanvasElement>(
      `canvas[${HIGHLIGHT_DATA_ATTRIBUTE_ID}="${elementId}"]`
    );

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.setAttribute(HIGHLIGHT_DATA_ATTRIBUTE_ID, elementId);

    canvas.style.position = 'relative';
    canvas.style.backgroundColor = 'transparent';
    canvas.style.pointerEvents = 'none';

    target.insertAdjacentElement('afterend', canvas);
  }

  return canvas;
};

export const findNodeAndLengthDiffForOffset = (
  nodes: Node[],
  offset: number
): [Node, number] => {
  let currentLength = nodes.reduce((sum, n) => {
    return sum + n.textContent!.length;
  }, 0);

  for (let i = nodes.length - 1; i > 0; i--) {
    if (offset < currentLength) {
      currentLength -= nodes[i].textContent!.length;
    } else {
      return [nodes[i + 1], currentLength];
    }
  }

  return [nodes[0], 0];
};

/**
 * Gets the coordinates of the suggestions within the target element.
 *
 * @param {TSuggestion[]} suggestions - The list of suggestions.
 * @param {HTMLDivElement} target - The target element.
 * @returns {TSuggestionCoordinates[]} The coordinates of the suggestions.
 */
export const getSuggestionsCoordinates = (
  suggestions: TSuggestion[],
  target: HTMLDivElement
): TSuggestionCoordinates[] => {
  const suggestionCoordinates: TSuggestionCoordinates[] = [];
  const textNodes = getTextNodes(target);

  suggestions.forEach((suggestion) => {
    const range = document.createRange();

    const [textNode, lengthDiff] = findNodeAndLengthDiffForOffset(
      textNodes,
      suggestion.offset
    );

    const offset = suggestion.offset - lengthDiff;

    range.setStart(textNode, offset);
    range.setEnd(textNode, offset + suggestion.length);
    const alert = range.getClientRects()[0];

    suggestionCoordinates.push({
      top: alert.top,
      left: alert.left,
      height: alert.height,
      width: alert.width,
    });
  });

  return suggestionCoordinates;
};

/**
 * Mirrors the target element's dimensions and position to the canvas.
 *
 * @param {HTMLDivElement} target - The target element.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 */
export const mirrorDivElWithCanvas = (
  target: HTMLDivElement,
  canvas: HTMLCanvasElement
) => {
  const targetElRect = target.getBoundingClientRect();

  canvas.style.width = targetElRect.width + 'px';
  canvas.style.height = targetElRect.height + 'px';
  canvas.width = targetElRect.width;
  canvas.height = targetElRect.height;
  canvas.style.top = `-${targetElRect.height}px`;
  // TODO: THIS WOULD BE NEEDED WHEN THIS IS MOVED TO SHARED CODE FOR AN EXTENSION
  // canvas.style.left = `${targetElRect.x}px`;
};

/**
 * Clears the canvas.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to clear.
 */
export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Updates the text of the target element with the suggestion.
 *
 * @param {string} elementId - The ID of the element.
 * @param {TSuggestion} suggestion - The suggestion to apply.
 */
export const updateTargetElTextWithSuggestion = (
  elementId: string,
  suggestion: TSuggestion
) => {
  const target = getTargetElementById(elementId);

  if (!target) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  const textNodes = getTextNodes(target);

  const [textNode, lengthDiff] = findNodeAndLengthDiffForOffset(
    textNodes,
    suggestion.offset
  );

  const offset = suggestion.offset - lengthDiff;

  const newTextContent = replaceTextWithSuggestion(
    textNode.textContent!,
    suggestion.replacements[0].value,
    offset,
    suggestion.length
  );

  textNode.textContent = newTextContent;

  const changeEvent = new Event('change', {
    bubbles: true,
    cancelable: true,
  });

  target.dispatchEvent(changeEvent);

  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
  });

  target.dispatchEvent(inputEvent);
};

/**
 * Calculates the offset for the text node.
 *
 * @param {number} textNodeIndex - The index of the text node.
 * @param {number[]} endIndexes - The list of text node end indexes.
 * @param {number} suggestionOffset - The offset of the suggestion.
 * @returns {number} The calculated offset.
 */
export const calculateOffset = (
  textNodeIndex: number,
  endIndexes: number[],
  suggestionOffset: number
): number => {
  return textNodeIndex === 0
    ? suggestionOffset
    : suggestionOffset - endIndexes[textNodeIndex - 1] - 1;
};

/**
 * Removes the canvas element associated with the given element ID.
 *
 * @param {string} elementId - The ID of the element whose associated canvas should be removed.
 */
export const removeElCanvas = (elementId: string) => {
  // Query the DOM for a canvas element with the specified data attribute
  const canvas = document.querySelector<HTMLCanvasElement>(
    `canvas[${HIGHLIGHT_DATA_ATTRIBUTE_ID}="${elementId}"]`
  );

  // If the canvas element is found, remove it from the DOM
  canvas?.remove();
};

/**
 * Finds the target element based on the mouse event and a list of element IDs.
 *
 * @param {MouseEvent} e - The mouse event.
 * @param {string[]} elementIdS - The list of element IDs to match against.
 * @returns {HTMLDivElement | null} - The target element if found, otherwise null.
 */
export const findTargetElement = (
  e: MouseEvent,
  elementIdS: string[]
): HTMLDivElement | null => {
  for (const elementId of elementIdS) {
    if (
      // @ts-ignore
      e.target?.matches(
        `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementId}"], div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementId}"] *`
      )
    ) {
      return getTargetElementById(elementId);
    }
  }
  return null;
};

/**
 * Finds the suggestion and its bounding rectangle based on the mouse event, target element, and list of suggestions.
 *
 * @param {MouseEvent} e - The mouse event.
 * @param {HTMLDivElement} target - The target element.
 * @param {TSuggestion[]} suggestions - The list of suggestions.
 * @returns {{ suggestion: TSuggestion | undefined; rect: DOMRect | undefined }} - The suggestion and its bounding rectangle if found, otherwise undefined.
 */
export const findSuggestionAndRect = (
  e: MouseEvent,
  target: HTMLDivElement,
  suggestions: TSuggestion[]
): { suggestion: TSuggestion | undefined; rect: DOMRect | undefined } => {
  const textNodes = getTextNodes(target);

  for (const suggestion of suggestions) {
    const range = document.createRange();
    const [textNode, lengthDiff] = findNodeAndLengthDiffForOffset(
      textNodes,
      suggestion.offset
    );

    const offset = suggestion.offset - lengthDiff;

    range.setStart(textNode, offset);
    range.setEnd(textNode, offset + suggestion.length);
    const rect = range.getClientRects()[0];

    if (
      rect.top <= e.clientY &&
      rect.bottom >= e.clientY &&
      rect.left <= e.clientX &&
      rect.right >= e.clientX
    ) {
      return { suggestion, rect };
    }
  }

  return { suggestion: undefined, rect: undefined };
};

/**
 * Queries the DOM for a div element with the specified data attribute.
 *
 * @param {string} elementId - The ID of the element to query.
 * @returns {HTMLDivElement | null} - The target element if found, otherwise null.
 */
export const getTargetElementById = (
  elementId: string
): HTMLDivElement | null => {
  return document.querySelector<HTMLDivElement>(
    `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementId}"]`
  );
};

/**
 * Retrieves the ID of the target element based on a specific data attribute.
 *
 * @param {Element} el - The element from which to retrieve the ID.
 * @returns {string | null} - The ID of the target element if found, otherwise null.
 */
export const getIdOfTargetElement = (el: Element): string | null =>
  el.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

/**
 * Watches for position changes of the specified element and triggers a callback when a change is detected.
 *
 * @param {Element} el - The element to watch for position changes.
 * @param {function} callback - The callback function to execute when the element's position changes.
 */
export const watchElementPositionChange = (
  el: Element,
  callback: (el: Element) => void
) => {
  let lastRect = el.getBoundingClientRect();
  let active = false;

  const loopAnimationFrame = () => {
    if (!active) return;

    const currentRect = el.getBoundingClientRect();

    if (lastRect.x !== currentRect.x || lastRect.y !== currentRect.y) {
      callback(el);
      lastRect = currentRect; // Update lastRect to the currentRect after the callback
    }

    requestAnimationFrame(loopAnimationFrame);
  };

  loopAnimationFrame();

  return {
    start() {
      active = true;
      loopAnimationFrame();
    },
    stop() {
      active = false;
    },
  };
};
