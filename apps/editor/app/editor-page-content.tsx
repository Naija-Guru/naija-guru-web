import { useState, useRef, useCallback, useMemo } from 'react';
import { AlertCircle, File, FileCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { VirtualElement } from '@floating-ui/dom';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Button,
  Popover,
  cn,
} from '@naija-spell-checker/ui';

import { getSpellCheck } from '@/api/spellCheck';
import { asyncWrapper, debounce } from '@/lib/utils';
import { TSuggestion } from '@/models/suggestion';
import {
  ELEMENT_DATA_ATTRIBUTE_ID,
  HIGHLIGHT_DATA_ATTRIBUTE_ID,
  SAMPLE_TEXT,
} from '@/constants/index';
import { TAlert } from '@/models/alerts';
import { useElementRemoved } from '@/hooks/useElementRemoved';
import { Editor } from '@/components/editor';
import {
  isPointInVisiblePartOfElement,
  findTextNodeIndexFromListOfTextNodeEndIndexes,
  getTextNodes,
  getTextNodesEndIndexes,
} from '@/lib/dom';
import { useObserveContentEditableElements } from '@/hooks/useObserveContentEditableElements';
import { useDomLayoutChange } from '@/hooks/useDomLayoutChange';
import { useClickEventDelegation } from '@/hooks/useClickEventDelegation';

export default function EditorPageContent() {
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionsListRef = useRef<Record<string, TSuggestion[]>>({});
  const [suggestionsList, setSuggestionsList] = useState<
    Record<string, TSuggestion[]>
  >({});
  const isSuggestionsListEmpty = useMemo(
    () => Object.values(suggestionsList).flat().length < 1,
    [suggestionsList]
  );
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    elementId: string;
    suggestion: TSuggestion;
  } | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [anchorRef, setAnchorRef] = useState<VirtualElement | null>(null);
  const [editorContent, setEditorContent] = useState('');

  const onUseSampleContent = () => {
    setEditorContent(SAMPLE_TEXT);
  };

  const toggleSuggestionPopover = (open: boolean) => {
    if (!open) {
      setSelectedSuggestion(null);
    }
    setIsPopoverOpen(open);
  };

  const highlightElementSuggestions = (elementId: string) => {
    const target = document.querySelector<HTMLDivElement>(
      `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementId}"]`
    );

    if (!target) return;

    const suggestions = suggestionsListRef.current[elementId];
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
    ctx?.clearRect(0, 0, highlights.width, highlights.height);

    if (!suggestions) return;

    const alerts: TAlert[] = [];

    const textNodes = getTextNodes(target);

    const endIndexes = getTextNodesEndIndexes(textNodes);

    suggestions.forEach((suggestion) => {
      const range = document.createRange();
      const textNodeIndex = findTextNodeIndexFromListOfTextNodeEndIndexes(
        endIndexes,
        suggestion.offset + suggestion.length - 1
      );

      const textNode = textNodes[textNodeIndex];

      const offset =
        textNodeIndex === 0
          ? suggestion.offset
          : suggestion.offset - endIndexes[textNodeIndex - 1] - 1;

      range.setStart(textNode, offset);
      range.setEnd(textNode, offset + suggestion.length);
      const alert = range.getClientRects()[0];

      alerts.push({
        top: alert.top,
        left: alert.left,
        height: alert.height,
        width: alert.width,
      });
    });

    const targetElRect = target.getBoundingClientRect();

    highlights.style.position = 'fixed';
    highlights.style.width = targetElRect.width + 'px';
    highlights.style.height = targetElRect.height + 'px';
    highlights.width = targetElRect.width;
    highlights.height = targetElRect.height;

    highlights.style.top = targetElRect.y + 'px';
    highlights.style.left = targetElRect.x + 'px';
    highlights.style.backgroundColor = 'transparent';
    highlights.style.pointerEvents = 'none';

    alerts.forEach((alert) => {
      if (ctx && isPointInVisiblePartOfElement(alert.left, alert.top, target)) {
        ctx.fillStyle = 'red';
        ctx.fillRect(
          alert.left - targetElRect.x,
          alert.top + alert.height - 1 - targetElRect.y,
          alert.width,
          3
        );
      }
    });
  };

  const clearHighlights = useCallback((elementId: string) => {
    const { [elementId]: _, ...rest } = suggestionsListRef.current;

    suggestionsListRef.current = {
      ...rest,
    };
    setSuggestionsList(suggestionsListRef.current);
    highlightElementSuggestions(elementId);
  }, []);

  const checkContentEditableElement = useCallback(
    async (target: HTMLElement) => {
      if (!target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID)) {
        const id = uuidv4();
        target.setAttribute(ELEMENT_DATA_ATTRIBUTE_ID, id);
        target.setAttribute('spellcheck', 'false');
      }

      const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

      if (!elementId) return;

      const text = target.textContent?.trim() || '';

      if (text.length) {
        setLoadingSuggestions(true);
        const [data] = await asyncWrapper(getSpellCheck(text));
        setLoadingSuggestions(false);
        if (!data) {
          clearHighlights(elementId);
          return;
        }

        const suggestions = data.matches;

        suggestionsListRef.current = {
          ...suggestionsListRef.current,
          [elementId]: suggestions,
        };
        setSuggestionsList(suggestionsListRef.current);
        highlightElementSuggestions(elementId);
      } else {
        clearHighlights(elementId);
      }
    },
    [clearHighlights]
  );

  const applySuggestion = (elementId: string, suggestion: TSuggestion) => {
    toggleSuggestionPopover(false);

    const remainingSuggestions = suggestionsListRef.current[elementId].filter(
      (s) => s.offset !== suggestion.offset
    );

    suggestionsListRef.current = {
      ...suggestionsListRef.current,
      [elementId]: remainingSuggestions,
    };
    setSuggestionsList(suggestionsListRef.current);

    const target = document.querySelector<HTMLDivElement>(
      `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementId}"]`
    );

    if (!target) return;

    const textNodes = getTextNodes(target);

    const endIndexes = getTextNodesEndIndexes(textNodes);

    const textNodeIndex = findTextNodeIndexFromListOfTextNodeEndIndexes(
      endIndexes,
      suggestion.offset + suggestion.length - 1
    );

    const textNode = textNodes[textNodeIndex];

    const offset =
      textNodeIndex === 0
        ? suggestion.offset
        : suggestion.offset - endIndexes[textNodeIndex - 1] - 1;

    const textContent = textNode.textContent ?? '';

    const newTextContent =
      textContent.slice(0, offset) +
      suggestion.replacements[0].value +
      textContent.slice(offset + suggestion.length);

    textNode.textContent = newTextContent;
  };

  const observeContentEditableElement = useCallback(
    (element: ObservableHTMLElement) => {
      const debounceCheckContentEditableElement = debounce(
        checkContentEditableElement,
        500
      );
      const contentObserver = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (
            mutation.type === 'childList' ||
            mutation.type === 'characterData'
          ) {
            debounceCheckContentEditableElement(element);
          }
        });
      });

      contentObserver.observe(element, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      element._observer = contentObserver;
    },
    [checkContentEditableElement]
  );

  useObserveContentEditableElements(observeContentEditableElement);

  const showPopover = (e: MouseEvent) => {
    let target: HTMLDivElement | null = null;

    const elementIdS = Object.keys(suggestionsList);

    let index = 0;

    while (index < elementIdS.length) {
      if (
        // @ts-ignore
        e.target?.matches(
          `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementIdS[index]}"], div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementIdS[index]}"] *`
        )
      ) {
        target = document.querySelector<HTMLDivElement>(
          `div[${ELEMENT_DATA_ATTRIBUTE_ID}="${elementIdS[index]}"]`
        );
        break;
      }
      index++;
    }

    if (!target) return;

    const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

    if (!elementId) return;

    const suggestions = suggestionsList[elementId];

    if (!suggestions) return;

    const textNodes = getTextNodes(target);

    const endIndexes = getTextNodesEndIndexes(textNodes);

    let rect: DOMRect | undefined;
    let suggestion: TSuggestion | undefined;

    for (let s of suggestions) {
      const range = document.createRange();
      const textNodeIndex = findTextNodeIndexFromListOfTextNodeEndIndexes(
        endIndexes,
        s.offset + s.length - 1
      );

      const textNode = textNodes[textNodeIndex];
      const offset =
        textNodeIndex === 0
          ? s.offset
          : s.offset - endIndexes[textNodeIndex - 1] - 1;

      range.setStart(textNode, offset);
      range.setEnd(textNode, offset + s.length);
      rect = range.getClientRects()[0];

      if (
        rect.top <= e.clientY &&
        rect.bottom >= e.clientY &&
        rect.left <= e.clientX &&
        rect.right >= e.clientX
      ) {
        suggestion = s;
        break;
      }
    }

    if (suggestion && rect) {
      setSelectedSuggestion({
        elementId,
        suggestion,
      });

      const virtualEl: VirtualElement = {
        getBoundingClientRect: () => rect,
      };
      setAnchorRef(virtualEl);
      setIsPopoverOpen(true);
    }
  };

  const updateSuggestionsPositions = useCallback(() => {
    Object.keys(suggestionsList).forEach((elementId) => {
      highlightElementSuggestions(elementId);
    });
  }, [suggestionsList]);

  const requestAnimationFrameRequest = useRef<number | null>(null);
  const animateUpdateSuggestionsPositions = useCallback(() => {
    if (requestAnimationFrameRequest.current) {
      window.cancelAnimationFrame(requestAnimationFrameRequest.current);
    }
    requestAnimationFrameRequest.current = window.requestAnimationFrame(
      updateSuggestionsPositions
    );
  }, [updateSuggestionsPositions]);

  const handleRemoveNode = (node: Node) => {
    if (node instanceof HTMLElement) {
      const elementId = node.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);
      if (elementId) {
        clearHighlights(elementId);
        (node as ObservableHTMLElement)._observer?.disconnect();
        let highlights: HTMLCanvasElement | null =
          document.querySelector<HTMLCanvasElement>(
            `canvas[${HIGHLIGHT_DATA_ATTRIBUTE_ID}="${elementId}"]`
          );
        highlights?.remove();
      }
    }
  };

  useClickEventDelegation(showPopover);
  useDomLayoutChange(animateUpdateSuggestionsPositions);
  useElementRemoved(document.body, handleRemoveNode);

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-green">
            Pidgin English Spell Checker
          </h1>
          <div className="mb-4">
            <Button variant="outline" onClick={onUseSampleContent}>
              <File className="mr-2 h-4 w-4" />
              Use Sample content
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <Editor
              className="w-full h-[calc(100vh-300px)] p-4 bg-white overflow-auto text-xl border"
              content={editorContent}
              setContent={(c: string) => setEditorContent(c)}
            />
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
                'h-[250px]',
                'lg:h-[calc(100vh-300px)]',
                'border',
                'border-solid'
              )}
            >
              <h2 className="text-xl font-semibold p-4">Review Suggestions</h2>
              <Carousel className="w-full md:hidden">
                <CarouselContent>
                  {Object.entries(suggestionsList).map(
                    ([elementId, suggestions]) =>
                      suggestions.map((suggestion) => (
                        <CarouselItem key={elementId + suggestion.offset}>
                          <Alert
                            className="cursor-pointer w-4/6 mx-auto"
                            variant="destructive"
                          >
                            <AlertCircle className="h-5" />
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
                                disabled={loadingSuggestions}
                              >
                                Accept Suggestion
                              </Button>
                            </AlertDescription>
                          </Alert>
                        </CarouselItem>
                      ))
                  )}
                </CarouselContent>
                {!isSuggestionsListEmpty && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
              <ul className="overflow-y-scroll h-7/8 border-t border-solid p-4 hidden md:block">
                {Object.entries(suggestionsList).map(
                  ([elementId, suggestions]) =>
                    suggestions.map((suggestion) => (
                      <li key={elementId + suggestion.offset}>
                        <Alert
                          className="my-4 cursor-pointer"
                          variant="destructive"
                        >
                          <AlertCircle className="h-5" />
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
                              disabled={loadingSuggestions}
                            >
                              Accept Suggestion
                            </Button>
                          </AlertDescription>
                        </Alert>
                      </li>
                    ))
                )}
              </ul>
              {isSuggestionsListEmpty && (
                <div>
                  <FileCheck className="mx-auto h-20 w-20 text-green" />
                  <p className="p-4 text-center">You are all good here!</p>
                </div>
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
