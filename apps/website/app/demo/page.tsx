'use client';
import { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { getSpellCheck } from '@/api/spellCheck';
import { Popover, VirtualAnchor } from '@/components/ui/popover';
import { asyncWrapper, cn, debounce } from '@/lib/utils';
import { TMatch } from '@/models/match';
import {
  ELEMENT_DATA_ATTRIBUTE_ID,
  HIGHLIGHT_DATA_ATTRIBUTE_ID,
} from '@/constants/index';
import { TAlert } from '@/models/alerts';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function Demo() {
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const highlightSuggestionsRef = useRef<Record<string, TMatch[]>>({});
  const [highlightSuggestions, setHighlightSuggestions] = useState<
    Record<string, TMatch[]>
  >({});
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    elementId: string;
    suggestion: TMatch;
  } | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [anchorRef, setAnchorRef] = useState<VirtualAnchor | null>(null);

  const toggleSuggestionPopover = (open: boolean) => {
    if (!open) {
      setSelectedSuggestion(null);
    }
    setIsPopoverOpen(open);
  };

  const highlightElementMatches = (elementId: string) => {
    const target = document.querySelector<HTMLDivElement>(
      `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementId}"]`
    );

    if (!target) return;

    const textNode = Array.from(target.childNodes).filter(
      (n) => n.nodeType === n.TEXT_NODE
    )[0];

    const matches = highlightSuggestionsRef.current[elementId];

    if (!matches) return;

    const alerts: TAlert[] = [];

    matches.forEach((match) => {
      const range = document.createRange();
      range.setStart(textNode, match.offset);
      range.setEnd(textNode, match.offset + match.length);
      const alert = range.getClientRects()[0];

      alerts.push({
        top: alert.top,
        left: alert.left,
        height: alert.height,
        width: alert.width,
      });
    });

    let highlights: HTMLCanvasElement | null =
      document.querySelector<HTMLCanvasElement>(
        `canvas[${HIGHLIGHT_DATA_ATTRIBUTE_ID}="${elementId}"]`
      );

    if (!highlights) {
      highlights = document.createElement('canvas');
      highlights.setAttribute(HIGHLIGHT_DATA_ATTRIBUTE_ID, elementId);

      target.insertAdjacentElement('afterend', highlights);
    }

    const ctx = highlights.getContext('2d');

    if (!ctx) return;

    ctx.clearRect(0, 0, highlights.width, highlights.height);
    const targetElRect = target.getBoundingClientRect();

    highlights.style.position = 'fixed';
    // Set the canvas size and position to match the target element
    highlights.style.width = targetElRect.width + 'px';
    highlights.style.height = targetElRect.height + 'px';
    highlights.width = targetElRect.width; // For canvas drawing coordinates
    highlights.height = targetElRect.height; // For canvas drawing coordinates

    highlights.style.top = targetElRect.y + 'px';
    highlights.style.left = targetElRect.x + 'px';
    highlights.style.backgroundColor = 'transparent';
    highlights.style.pointerEvents = 'none';

    alerts.forEach((alert) => {
      ctx.fillStyle = 'red';
      ctx.fillRect(
        alert.left - targetElRect.x,
        alert.top + alert.height - 1 - targetElRect.y,
        alert.width,
        3
      );
    });
  };

  const checkContentEditableElement = async (target: HTMLDivElement) => {
    if (!target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID)) {
      target.setAttribute(ELEMENT_DATA_ATTRIBUTE_ID, uuidv4());
    }

    const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

    if (!elementId) return;

    const textNode = Array.from(target.childNodes).filter(
      (n) => n.nodeType === n.TEXT_NODE
    )[0];

    const text = textNode?.textContent?.trim() || '';

    if (text === '') return;

    setLoadingSuggestions(true);
    const [data] = await asyncWrapper(getSpellCheck(text));
    setLoadingSuggestions(false);
    if (!data) return;

    const matches = data.matches;

    highlightSuggestionsRef.current = {
      ...highlightSuggestionsRef.current,
      [elementId]: matches,
    };
    setHighlightSuggestions(highlightSuggestionsRef.current);
    highlightElementMatches(elementId);
  };

  const applySuggestion = (elementId: string, suggestion: TMatch) => {
    toggleSuggestionPopover(false);

    const target = document.querySelector<HTMLDivElement>(
      `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementId}"]`
    );

    if (!target) return;

    const textContent = target.textContent || '';

    const newTextContent =
      textContent.slice(0, suggestion.offset) +
      suggestion.replacements[0].value +
      textContent.slice(suggestion.offset + suggestion.length);

    target.textContent = newTextContent;
    target.dispatchEvent(
      new Event('input', { bubbles: true, cancelable: true })
    );
  };

  useEffect(() => {
    const check = (e: Event) => {
      // @ts-ignore
      if (e.target?.tagName === 'DIV' && e.target?.isContentEditable) {
        const target = e.target as HTMLDivElement;
        checkContentEditableElement(target);
      }
    };

    const debouncedCheck = debounce(check, 500);
    document.addEventListener('input', debouncedCheck);

    return () => {
      document.removeEventListener('input', debouncedCheck);
    };
  }, []);

  useEffect(() => {
    const updateHighlights = () => {
      Object.keys(highlightSuggestions).forEach((elementId) => {
        highlightElementMatches(elementId);
      });
    };

    const showPopover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target) return;

      if (target.tagName === 'DIV' && target.isContentEditable) {
        const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

        if (!elementId) return;

        const matches = highlightSuggestions[elementId];

        if (!matches) return;

        const textNode = Array.from(target.childNodes).filter(
          (n) => n.nodeType === n.TEXT_NODE
        )[0];

        let rect: DOMRect | null = null;

        const match = matches.find((match) => {
          const range = document.createRange();
          range.setStart(textNode, match.offset);
          range.setEnd(textNode, match.offset + match.length);
          rect = range.getClientRects()[0];

          return (
            rect.top <= e.clientY &&
            rect.bottom >= e.clientY &&
            rect.left <= e.clientX &&
            rect.right >= e.clientX
          );
        });

        if (!match || rect === null) return;

        setSelectedSuggestion({
          elementId,
          suggestion: match,
        });

        const virtualEl: VirtualAnchor = {
          getBoundingClientRect() {
            return {
              x: rect?.x || 0,
              y: rect?.y || 0,
              top: rect?.top || 0,
              left: rect?.left || 0,
              bottom: rect?.bottom || 0,
              right: rect?.right || 0,
              width: rect?.width || 0,
              height: rect?.height || 0,
            };
          },
        };
        setAnchorRef(virtualEl);
        setIsPopoverOpen(true);
      }
    };

    window.addEventListener('scroll', updateHighlights);
    window.addEventListener('resize', updateHighlights);
    document.addEventListener('click', showPopover);

    return () => {
      window.removeEventListener('scroll', updateHighlights);
      window.removeEventListener('resize', updateHighlights);
      document.removeEventListener('click', showPopover);
    };
  }, [highlightSuggestions]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Free Online Pidgin English Checker
          </h1>
          <div className="flex flex-col lg:flex-row gap-6">
            <div
              className="w-full h-[calc(100vh-200px)] p-4 bg-white overflow-auto text-xl"
              contentEditable
              suppressContentEditableWarning
            >
              Make I tell you, life na journey wey no get one road. Sometimes,
              you go waka for smooth road, everything go dey jolly, but other
              times, e fit be say na wahala full the road. Na why dem talk say,
              no matter how e be, you gatz hold strong, no give up. As you dey
              hustle, you go see say no be every day go soft, but na the ginger
              wey you carry for mind go make the wahala no too heavy. Even if
              rain fall or sun shine, you gatz waka your waka because na
              persistence dey bring beta result. Last last, e no matter how slow
              or fast you dey go, as long as you no sidon dey look, you go reach
              where you wan reach.
            </div>
            <div
              className={cn(
                'flex',
                'flex-col',
                'lg:w-1/3',
                'lg:static',
                'fixed',
                'bottom-0',
                'left-0',
                'right-0',
                'bg-white',
                'h-[300px]',
                'lg:h-[calc(100vh-200px)]',
                'p-4'
              )}
            >
              <h2 className="text-xl font-semibold mb-4">Review Suggestions</h2>
              {loadingSuggestions ? (
                <Spinner className="mx-auto h-20 w-20" />
              ) : (
                <ul className="overflow-y-scroll h-7/8">
                  {Object.entries(highlightSuggestions).map(
                    ([elementId, suggestions]) =>
                      suggestions.map((suggestion) => (
                        <li key={elementId + suggestion.offset}>
                          <Alert
                            className="my-4 cursor-pointer"
                            variant="destructive"
                          >
                            <AlertCircle className="h-5 w-" />
                            <AlertTitle className="font-normal">
                              {suggestion.message}
                            </AlertTitle>
                            <AlertDescription className="font-bold text-xl">
                              <p>{suggestion.replacements[0].value}</p>
                              <Button
                                className="my-4"
                                onClick={() =>
                                  applySuggestion(elementId, suggestion)
                                }
                              >
                                Accept Suggestion
                              </Button>
                            </AlertDescription>
                          </Alert>
                        </li>
                      ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <Popover
        open={isPopoverOpen && Boolean(selectedSuggestion)}
        toggleOpen={toggleSuggestionPopover}
        virtualAnchor={anchorRef}
      >
        {selectedSuggestion && (
          <>
            <h4 className="mb-2">Suggestion</h4>
            <p className="text-primary font-bold text-xl mb-2">
              {selectedSuggestion.suggestion.replacements[0].value}
            </p>
            <p className="text-xs mb-4">
              {selectedSuggestion.suggestion.message}
            </p>
            <Button
              onClick={() =>
                applySuggestion(
                  selectedSuggestion.elementId,
                  selectedSuggestion.suggestion
                )
              }
            >
              Accept Suggestion
            </Button>
          </>
        )}
      </Popover>
    </>
  );
}
