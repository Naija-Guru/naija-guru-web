/* eslint-disable @typescript-eslint/no-unused-vars */
import { VirtualElement } from '@floating-ui/dom';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useToast } from '@naija-spell-checker/ui';

import { getSpellingSuggestions } from '@/api/spellCheck';
import { Editor } from '@/components/wysiwyg-editor/editor';
import { ELEMENT_DATA_ATTRIBUTE_ID } from '@/constants/dom';
import { useClickEventDelegation } from '@/hooks/use-click-event-delegation';
import { useElementRemoved } from '@/hooks/use-element-removed';
import { useObserveContentEditableElements } from '@/hooks/use-observe-content-editable-elements';
import { useListenToElementsScroll } from '@/hooks/use-listen-to-Elements-scroll';
import { useObserveElementsResize } from '@/hooks/use-observe-elements-resize';
import { asyncWrapper } from '@/lib/async';
import {
  clearCanvas,
  disableElementNativeSpellCheck,
  drawHighlightsForElementSuggestions,
  findSuggestionAndRect,
  findTargetElement,
  getIdOfTargetElement,
  getOrCreateHighlightCanvas,
  getTargetElementById,
  removeElCanvas,
  setIdOfTargetElement,
  updateTargetElTextWithSuggestion,
} from '@/lib/dom';
import { TSuggestion } from '@/models/suggestion';

import { ReviewSuggestions } from '@/components/review-suggestions';
import { SuggestionPopover } from '@/components/suggestion-popover';
import { addElObserver, disconnectElObserver } from '@/lib/observer';
import { getSavedPreferencesState } from '@/lib/storage';
import { debounce, filterSuggestions } from '@/lib/utils';
import { useSuggestionsReducer } from '@/reducers/suggestions-reducer';
import { AddSampleContent } from '@/components/add-sample-content';

export default function Content() {
  const { toast } = useToast();

  const [suggestionsState, suggestionsStateDispatch] = useSuggestionsReducer();
  const suggestionsListRef = useRef<Record<string, TSuggestion[]>>({});

  const isSuggestionsListEmpty = useMemo(
    () => Object.values(suggestionsState.suggestionsList).flat().length < 1,
    [suggestionsState.suggestionsList]
  );

  const toggleSuggestionPopover = useCallback(
    (open: boolean) => {
      if (!open) {
        suggestionsStateDispatch({
          type: 'SET_SELECTED_SUGGESTION',
          payload: null,
        });
      }
      suggestionsStateDispatch({ type: 'SET_IS_POPOVER_OPEN', payload: open });
    },
    [suggestionsStateDispatch]
  );

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

  const clearHighlights = useCallback(
    (elementId: string) => {
      const { [elementId]: _, ...rest } = suggestionsListRef.current;
      suggestionsListRef.current = {
        ...rest,
      };
      suggestionsStateDispatch({
        type: 'SET_SUGGESTIONS_LIST',
        payload: suggestionsListRef.current,
      });
      highlightElementSuggestions(elementId);
    },
    [suggestionsStateDispatch]
  );

  const checkContentEditableElement = useCallback(
    async (target: HTMLElement) => {
      suggestionsStateDispatch({
        type: 'SET_LOADING_SUGGESTIONS',
        payload: true,
      });
      const elementId = setIdOfTargetElement(target);
      disableElementNativeSpellCheck(target);

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
        const { ignoredCategories, ignoredRules } = getSavedPreferencesState();
        const filteredSuggestions = filterSuggestions(
          suggestions,
          ignoredRules,
          ignoredCategories
        );

        suggestionsListRef.current = {
          ...suggestionsListRef.current,
          [elementId]: filteredSuggestions,
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
    [clearHighlights, suggestionsStateDispatch, toast]
  );

  const handleApplySuggestion = useCallback(
    (elementId: string, suggestion: TSuggestion, replacementIndex?: number) => {
      toggleSuggestionPopover(false);
      updateTargetElTextWithSuggestion(elementId, suggestion, replacementIndex);
    },
    [toggleSuggestionPopover]
  );

  const handleIgnoreRuleOrCategory = useCallback(
    (elementId: string) => {
      toggleSuggestionPopover(false);
      const el = getTargetElementById(elementId);

      if (el) {
        checkContentEditableElement(el);
      }
    },
    [checkContentEditableElement, toggleSuggestionPopover]
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
      suggestionsStateDispatch,
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
    handleApplySuggestion(
      elementId,
      suggestionsState.suggestionsList[elementId][0],
      0
    );
  }, [suggestionsState.suggestionsList, handleApplySuggestion]);

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
    suggestionsStateDispatch,
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

  const handleAddSampleContent = useCallback(
    (content: string) => {
      suggestionsStateDispatch({
        type: 'SET_EDITOR_CONTENT',
        payload: content,
      });
    },
    [suggestionsStateDispatch]
  );

  useObserveElementsResize(targetedElements, handleElementPositionChange);
  useListenToElementsScroll(targetedElements, handleElementPositionChange);
  useClickEventDelegation(showPopover);
  useElementRemoved(document.body, handleRemoveNode);
  useObserveContentEditableElements(handleObserveContentEditableElements);

  return (
    <>
      <div
        className="tw-min-h-screen tw-m-auto tw-max-w-[1200px] tw-p-4 md:tw-py-10"
        suppressHydrationWarning
      >
        <div className="tw-max-w-8xl tw-mx-auto">
          <h1 className="tw-text-xl md:tw-text-3xl tw-font-bold tw-mb-6 tw-text-secondary tw-text-center md:tw-text-left">
            Pidgin English Spell Checker
          </h1>
          <AddSampleContent onAddSampleContent={handleAddSampleContent} />
          <div className="tw-grid tw-grid-cols-3">
            <Editor
              className="tw-col-span-3 md:tw-col-span-2 tw-h-[calc(100vh-250px)] tw-p-4 tw-bg-white tw-overflow-auto md:tw-text-xl tw-border"
              content={suggestionsState.editorContent}
              setContent={(content: string) =>
                suggestionsStateDispatch({
                  type: 'SET_EDITOR_CONTENT',
                  payload: content,
                })
              }
              disabled={suggestionsState.isAcceptingAllSuggestions}
            />
            <ReviewSuggestions
              list={suggestionsState.suggestionsList}
              onApplySuggestion={handleApplySuggestion}
              onIgnoreRuleOrCategory={handleIgnoreRuleOrCategory}
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
          onApplySuggestion={handleApplySuggestion}
        />
      )}
    </>
  );
}
