export const findTextNodeIndexFromListOfTextNodeEndIndexes = (
  endIndexes: number[],
  offset: number
) => {
  let left = 0;
  let right = endIndexes.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const guess = endIndexes[mid];
    if (guess === offset) {
      return mid;
    }

    if (offset < guess && offset > endIndexes[mid - 1]) {
      return mid;
    }

    if (guess < offset) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
};

export const getTextNodes = (el: HTMLElement) => {
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  return nodes;
};

export const getTextNodesEndIndexes = (textNodes: Node[]) => {
  const endIndexes = textNodes.reduce((acc, node) => {
    if (acc.length === 0) {
      return [node.textContent ? node.textContent.length - 1 : 0];
    }
    return [...acc, acc[acc.length - 1] + (node.textContent?.length || 0)];
  }, [] as number[]);

  return endIndexes;
};

export function isPointInVisiblePartOfElement(
  x: number,
  y: number,
  element: HTMLElement
) {
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
