'use client';

import { VirtualElement } from '@floating-ui/dom';
import { File } from 'lucide-react';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button, useToast } from '@naija-spell-checker/ui';

import { getSpellingSuggestions } from '@/api/spellCheck';
import { Editor } from '@/components/editor';
import { ELEMENT_DATA_ATTRIBUTE_ID, SAMPLE_TEXT } from '@/constants/index';
import { useClickEventDelegation } from '@/hooks/useClickEventDelegation';
import { useElementRemoved } from '@/hooks/useElementRemoved';
import { useObserveContentEditableElements } from '@/hooks/useObserveContentEditableElements';
import { asyncWrapper } from '@/lib/async';
import {
  clearCanvas,
  drawHighlightsForElementSuggestions,
  findSuggestionAndRect,
  findTargetElement,
  getIdOfTargetElement,
  getOrCreateHighlightCanvas,
  getTargetElementById,
  removeElCanvas,
  updateTargetElTextWithSuggestion,
} from '@/lib/dom';
import { TSuggestion } from '@/models/suggestion';

import { addElObserver, disconnectElObserver } from '@/lib/observer';
import { debounce } from '@/lib/utils';
import { SuggestionPopover } from '@/components/suggestion-popover';
import { ReviewSuggestions } from '@/components/review-suggestions';

import { useObserveElementsResize } from '@/hooks/useObserveElementsResize';
import { useListenToElementsScroll } from '@/hooks/useListenToElementsScroll';
import { useSuggestionsReducer } from 'reducers/suggestions-reducer';

export default function Content() {
  const { toast } = useToast();

  const [suggestionsState, suggestionsStateDispatch] = useSuggestionsReducer();
  const suggestionsListRef = useRef<Record<string, TSuggestion[]>>({});

  const isSuggestionsListEmpty = useMemo(
    () => Object.values(suggestionsState.suggestionsList).flat().length < 1,
    [suggestionsState.suggestionsList]
  );

  const onUseSampleContent = () => {
    suggestionsStateDispatch({
      type: 'SET_EDITOR_CONTENT',
      payload: SAMPLE_TEXT,
    });
  };

  const toggleSuggestionPopover = (open: boolean) => {
    if (!open) {
      suggestionsStateDispatch({
        type: 'SET_SELECTED_SUGGESTION',
        payload: null,
      });
    }
    suggestionsStateDispatch({ type: 'SET_IS_POPOVER_OPEN', payload: open });
  };

  const highlightElementSuggestions = (elementId: string) => {
    const suggestions = suggestionsListRef.current[elementId];
    if (suggestions) {
      drawHighlightsForElementSuggestions(elementId, suggestions);
    } else {
      const canvas = getOrCreateHighlightCanvas(elementId);
      if (canvas) {
        clearCanvas(canvas);
      }
    }
  };

  const clearHighlights = useCallback((elementId: string) => {
    const { [elementId]: _, ...rest } = suggestionsListRef.current;
    suggestionsListRef.current = {
      ...rest,
    };
    suggestionsStateDispatch({
      type: 'SET_SUGGESTIONS_LIST',
      payload: suggestionsListRef.current,
    });
    highlightElementSuggestions(elementId);
  }, []);

  const checkContentEditableElement = useCallback(
    async (target: HTMLElement) => {
      suggestionsStateDispatch({
        type: 'SET_LOADING_SUGGESTIONS',
        payload: true,
      });
      if (!target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID)) {
        const id = uuidv4();
        target.setAttribute(ELEMENT_DATA_ATTRIBUTE_ID, id);
        target.setAttribute('spellcheck', 'false');
      }

      const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

      if (!elementId) return;

      const text = target.textContent?.trim() || '';

      if (text.length) {
        const [data, error] = await asyncWrapper(getSpellingSuggestions(text));
        if (!data) {
          clearHighlights(elementId);
          toast({
            title: 'Error occurred',
            description:
              error?.message || error?.name || 'Unknown error occurred',
            variant: 'destructive',
          });
          return;
        }

        const suggestions = data.matches;

        suggestionsListRef.current = {
          ...suggestionsListRef.current,
          [elementId]: suggestions,
        };
        suggestionsStateDispatch({
          type: 'SET_SUGGESTIONS_LIST',
          payload: suggestionsListRef.current,
        });
        highlightElementSuggestions(elementId);
      } else {
        clearHighlights(elementId);
      }
      suggestionsStateDispatch({
        type: 'SET_LOADING_SUGGESTIONS',
        payload: false,
      });
    },
    [clearHighlights]
  );

  const applySuggestion = useCallback(
    (elementId: string, suggestion: TSuggestion) => {
      toggleSuggestionPopover(false);
      updateTargetElTextWithSuggestion(elementId, suggestion);
    },
    []
  );

  const showPopover = useCallback(
    (e: MouseEvent) => {
      if (suggestionsState.isAcceptingAllSuggestions) return;
      const elementIdS = Object.keys(suggestionsState.suggestionsList);
      const target = findTargetElement(e, elementIdS);

      if (!target) return;

      const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

      if (!elementId) return;

      const suggestions = suggestionsState.suggestionsList[elementId];

      if (!suggestions) return;

      const { suggestion, rect } = findSuggestionAndRect(
        e,
        target,
        suggestions
      );

      if (suggestion && rect) {
        suggestionsStateDispatch({
          type: 'SET_SELECTED_SUGGESTION',
          payload: { elementId, suggestion },
        });

        const virtualEl: VirtualElement = {
          getBoundingClientRect: () => rect,
        };
        suggestionsStateDispatch({
          type: 'SET_ANCHOR_REF',
          payload: virtualEl,
        });
        suggestionsStateDispatch({
          type: 'SET_IS_POPOVER_OPEN',
          payload: true,
        });
      }
    },
    [
      suggestionsState.isAcceptingAllSuggestions,
      suggestionsState.suggestionsList,
    ]
  );

  const handleRemoveNode = (node: Node) => {
    if (node instanceof HTMLElement) {
      const elementId = node.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);
      if (elementId) {
        clearHighlights(elementId);
        disconnectElObserver(node as ObservableHTMLElement);
        removeElCanvas(elementId);
      }
    }
  };

  const handleObserveContentEditableElements = useCallback(
    (el: HTMLElement) => {
      const debouncedChecker = debounce(checkContentEditableElement, 500);
      addElObserver(el, debouncedChecker);
    },
    [checkContentEditableElement]
  );

  const handleApplyAllSuggestions = () => {
    suggestionsStateDispatch({ type: 'SET_IS_FIXING_ALL', payload: true });
  };

  const handleAcceptFirstSuggestionOnList = useCallback(() => {
    const elementId = Object.keys(suggestionsState.suggestionsList)[0];
    applySuggestion(elementId, suggestionsState.suggestionsList[elementId][0]);
  }, [suggestionsState.suggestionsList, applySuggestion]);

  useEffect(() => {
    if (
      suggestionsState.isAcceptingAllSuggestions &&
      !suggestionsState.loadingSuggestions
    ) {
      if (isSuggestionsListEmpty) {
        suggestionsStateDispatch({ type: 'SET_IS_FIXING_ALL', payload: false });
      } else {
        handleAcceptFirstSuggestionOnList();
      }
    }
  }, [
    suggestionsState.isAcceptingAllSuggestions,
    isSuggestionsListEmpty,
    suggestionsState.loadingSuggestions,
    handleAcceptFirstSuggestionOnList,
  ]);

  const elementIds = useMemo(
    () => Object.keys(suggestionsState.suggestionsList),
    [suggestionsState.suggestionsList]
  );

  const targetedElements = useMemo(
    () => elementIds.map(getTargetElementById).filter(Boolean) as Element[],
    [elementIds]
  );

  const handleElementPositionChange = (el: Element) => {
    const elementId = getIdOfTargetElement(el);

    if (!elementId) return;

    highlightElementSuggestions(elementId);
  };

  useObserveElementsResize(targetedElements, handleElementPositionChange);
  useListenToElementsScroll(targetedElements, handleElementPositionChange);
  useClickEventDelegation(showPopover);
  useElementRemoved(document.body, handleRemoveNode);
  useObserveContentEditableElements(handleObserveContentEditableElements);

  return (
    <>
      <div
        className="min-h-screen m-auto max-w-[1200px] p-4 md:py-10"
        suppressHydrationWarning
      >
        <div className="max-w-8xl mx-auto">
          <h1 className="text-xl md:text-3xl font-bold mb-6 text-secondary text-center md:text-left">
            Pidgin English Spell Checker
          </h1>
          <div className="mb-4 hidden md:block">
            <Button variant="outline" onClick={onUseSampleContent}>
              <File className="mr-2 h-4 w-4" />
              Insert Example Text
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <Editor
              className="w-full h-[calc(100vh-300px)] p-4 bg-white overflow-auto md:text-xl border"
              content={suggestionsState.editorContent}
              setContent={(c: string) =>
                suggestionsStateDispatch({
                  type: 'SET_EDITOR_CONTENT',
                  payload: c,
                })
              }
              disabled={suggestionsState.isAcceptingAllSuggestions}
            />
            <ReviewSuggestions
              list={suggestionsState.suggestionsList}
              onApplySuggestion={applySuggestion}
              onApplyAllSuggestions={handleApplyAllSuggestions}
              isLoadingSuggestions={suggestionsState.loadingSuggestions}
              isListEmpty={isSuggestionsListEmpty}
              isAcceptingAllSuggestions={
                suggestionsState.isAcceptingAllSuggestions
              }
            />
          </div>
        </div>
      </div>
      {suggestionsState.selectedSuggestion && (
        <SuggestionPopover
          isOpen={suggestionsState.isPopoverOpen}
          anchorRef={suggestionsState.anchorRef}
          toggle={toggleSuggestionPopover}
          elementId={suggestionsState.selectedSuggestion.elementId}
          suggestion={suggestionsState.selectedSuggestion.suggestion}
          onApplySuggestion={applySuggestion}
        />
      )}
    </>
  );
}
