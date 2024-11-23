'use client';

import { VirtualElement } from '@floating-ui/dom';
import { File } from 'lucide-react';
import { useCallback, useMemo, useReducer, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button, cn } from '@naija-spell-checker/ui';

import { getSpellingSuggestions } from '@/api/spellCheck';
import { Editor } from '@/components/editor';
import { ELEMENT_DATA_ATTRIBUTE_ID, SAMPLE_TEXT } from '@/constants/index';
import { useClickEventDelegation } from '@/hooks/useClickEventDelegation';
import { useDomLayoutChange } from '@/hooks/useDomLayoutChange';
import { useElementRemoved } from '@/hooks/useElementRemoved';
import { useObserveContentEditableElements } from '@/hooks/useObserveContentEditableElements';
import { asyncWrapper } from '@/lib/async';
import {
  clearCanvas,
  drawHighlightsForElementSuggestions,
  findSuggestionAndRect,
  findTargetElement,
  getOrCreateHighlightCanvas,
  removeElCanvas,
  updateTargetElTextWithSuggestion,
} from '@/lib/dom';
import { TSuggestion } from '@/models/suggestion';

import { addElObserver, removeElObserver } from '@/lib/observer';
import { debounce } from '@/lib/utils';
import { SuggestionPopover } from '@/components/suggestion-popover';
import { ReviewSuggestions } from '@/components/review-suggestions';

import { initialState, reducer } from './reducer';

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
  'h-[225px]',
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
      if (!target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID)) {
        const id = uuidv4();
        target.setAttribute(ELEMENT_DATA_ATTRIBUTE_ID, id);
        target.setAttribute('spellcheck', 'false');
      }

      const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

      if (!elementId) return;

      const text = target.textContent?.trim() || '';

      if (text.length) {
        dispatch({ type: 'SET_LOADING_SUGGESTIONS', payload: true });
        const [data] = await asyncWrapper(getSpellingSuggestions(text));
        dispatch({ type: 'SET_LOADING_SUGGESTIONS', payload: false });
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
    },
    [clearHighlights]
  );

  const applySuggestion = useCallback(
    (elementId: string, suggestion: TSuggestion) => {
      toggleSuggestionPopover(false);

      const remainingSuggestions = suggestionsListRef.current[elementId].filter(
        (s) => s.offset !== suggestion.offset
      );

      suggestionsListRef.current = {
        ...suggestionsListRef.current,
        [elementId]: remainingSuggestions,
      };
      dispatch({
        type: 'SET_SUGGESTIONS_LIST',
        payload: suggestionsListRef.current,
      });

      updateTargetElTextWithSuggestion(elementId, suggestion);
    },
    []
  );

  const showPopover = (e: MouseEvent) => {
    const elementIdS = Object.keys(state.suggestionsList);
    const target = findTargetElement(e, elementIdS);

    if (!target) return;

    const elementId = target.getAttribute(ELEMENT_DATA_ATTRIBUTE_ID);

    if (!elementId) return;

    const suggestions = state.suggestionsList[elementId];

    if (!suggestions) return;

    const { suggestion, rect } = findSuggestionAndRect(e, target, suggestions);

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
  };

  const updateSuggestionsPositions = useCallback(() => {
    Object.keys(state.suggestionsList).forEach((elementId) => {
      highlightElementSuggestions(elementId);
    });
  }, [state.suggestionsList]);

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
        removeElObserver(node as ObservableHTMLElement);
        removeElCanvas(elementId);
      }
    }
  };

  useClickEventDelegation(showPopover);
  useDomLayoutChange(animateUpdateSuggestionsPositions);
  useElementRemoved(document.body, handleRemoveNode);
  useObserveContentEditableElements(
    useCallback(
      (el) => {
        const debouncedChecker = debounce(checkContentEditableElement, 500);
        addElObserver(el, debouncedChecker);
      },
      [checkContentEditableElement]
    )
  );

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
            />
            <ReviewSuggestions
              className={suggestionsListContainerClassnames}
              list={state.suggestionsList}
              onApplySuggestion={applySuggestion}
              isLoadingSuggestions={state.loadingSuggestions}
              isListEmpty={isSuggestionsListEmpty}
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
