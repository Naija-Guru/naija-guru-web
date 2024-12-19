'use client';

import { VirtualElement } from '@floating-ui/dom';
import { File } from 'lucide-react';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button, cn } from '@naija-spell-checker/ui';

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

import { initialState, reducer } from './reducer';
import { useObserveElementsResize } from '@/hooks/useObserveElementsResize';
import { useListenToElementsScroll } from '@/hooks/useListenToElementsScroll';

const suggestionsListContainerClassnames = cn(
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
);

export default function Content() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const suggestionsListRef = useRef<Record<string, TSuggestion[]>>({});

  const isSuggestionsListEmpty = useMemo(
    () => Object.values(state.suggestionsList).flat().length < 1,
    [state.suggestionsList]
  );

  const onUseSampleContent = () => {
    dispatch({ type: 'SET_EDITOR_CONTENT', payload: SAMPLE_TEXT });
  };

  const toggleSuggestionPopover = (open: boolean) => {
    if (!open) {
      dispatch({ type: 'SET_SELECTED_SUGGESTION', payload: null });
    }
    dispatch({ type: 'SET_IS_POPOVER_OPEN', payload: open });
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
    dispatch({
      type: 'SET_SUGGESTIONS_LIST',
      payload: suggestionsListRef.current,
    });
    highlightElementSuggestions(elementId);
  }, []);

  const checkContentEditableElement = useCallback(
    async (target: HTMLElement) => {
      dispatch({ type: 'SET_LOADING_SUGGESTIONS', payload: true });
      if (!target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID)) {
        const id = uuidv4();
        target.setAttribute(ELEMENT_DATA_ATTRIBUTE_ID, id);
        target.setAttribute('spellcheck', 'false');
      }

      const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

      if (!elementId) return;

      const text = target.textContent?.trim() || '';

      if (text.length) {
        const [data] = await asyncWrapper(getSpellingSuggestions(text));
        if (!data) {
          clearHighlights(elementId);
          return;
        }

        const suggestions = data.matches;

        suggestionsListRef.current = {
          ...suggestionsListRef.current,
          [elementId]: suggestions,
        };
        dispatch({
          type: 'SET_SUGGESTIONS_LIST',
          payload: suggestionsListRef.current,
        });
        highlightElementSuggestions(elementId);
      } else {
        clearHighlights(elementId);
      }
      dispatch({ type: 'SET_LOADING_SUGGESTIONS', payload: false });
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
      if (state.isAcceptingAllSuggestions) return;
      const elementIdS = Object.keys(state.suggestionsList);
      const target = findTargetElement(e, elementIdS);

      if (!target) return;

      const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

      if (!elementId) return;

      const suggestions = state.suggestionsList[elementId];

      if (!suggestions) return;

      const { suggestion, rect } = findSuggestionAndRect(
        e,
        target,
        suggestions
      );

      if (suggestion && rect) {
        dispatch({
          type: 'SET_SELECTED_SUGGESTION',
          payload: { elementId, suggestion },
        });

        const virtualEl: VirtualElement = {
          getBoundingClientRect: () => rect,
        };
        dispatch({ type: 'SET_ANCHOR_REF', payload: virtualEl });
        dispatch({ type: 'SET_IS_POPOVER_OPEN', payload: true });
      }
    },
    [state.isAcceptingAllSuggestions, state.suggestionsList]
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
    dispatch({ type: 'SET_IS_FIXING_ALL', payload: true });
  };

  const handleAcceptFirstSuggestionOnList = useCallback(() => {
    const elementId = Object.keys(state.suggestionsList)[0];
    applySuggestion(elementId, state.suggestionsList[elementId][0]);
  }, [state.suggestionsList, applySuggestion]);

  useEffect(() => {
    if (state.isAcceptingAllSuggestions && !state.loadingSuggestions) {
      if (isSuggestionsListEmpty) {
        dispatch({ type: 'SET_IS_FIXING_ALL', payload: false });
      } else {
        handleAcceptFirstSuggestionOnList();
      }
    }
  }, [
    state.isAcceptingAllSuggestions,
    isSuggestionsListEmpty,
    state.loadingSuggestions,
    handleAcceptFirstSuggestionOnList,
  ]);

  const elementIds = useMemo(
    () => Object.keys(state.suggestionsList),
    [state.suggestionsList]
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
              Use Sample content
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <Editor
              className="w-full h-[calc(100vh-300px)] p-4 bg-white overflow-auto md:text-xl border"
              content={state.editorContent}
              setContent={(c: string) =>
                dispatch({ type: 'SET_EDITOR_CONTENT', payload: c })
              }
              disabled={state.isAcceptingAllSuggestions}
            />
            <ReviewSuggestions
              className={suggestionsListContainerClassnames}
              list={state.suggestionsList}
              onApplySuggestion={applySuggestion}
              onApplyAllSuggestions={handleApplyAllSuggestions}
              isLoadingSuggestions={state.loadingSuggestions}
              isListEmpty={isSuggestionsListEmpty}
              isAcceptingAllSuggestions={state.isAcceptingAllSuggestions}
            />
          </div>
        </div>
      </div>
      {state.selectedSuggestion && (
        <SuggestionPopover
          isOpen={state.isPopoverOpen}
          anchorRef={state.anchorRef}
          toggle={toggleSuggestionPopover}
          elementId={state.selectedSuggestion.elementId}
          suggestion={state.selectedSuggestion.suggestion}
          onApplySuggestion={applySuggestion}
        />
      )}
    </>
  );
}
