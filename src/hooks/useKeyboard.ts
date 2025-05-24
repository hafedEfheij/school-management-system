import { useEffect, useCallback } from 'react';

type KeyboardEventHandler = (event: KeyboardEvent) => void;

interface UseKeyboardOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}

/**
 * Custom hook for keyboard event handling
 */
export function useKeyboard(
  key: string | string[],
  handler: KeyboardEventHandler,
  options: UseKeyboardOptions = {}
) {
  const { preventDefault = false, stopPropagation = false, enabled = true } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const keys = Array.isArray(key) ? key : [key];
      const pressedKey = event.key.toLowerCase();
      
      if (keys.some(k => k.toLowerCase() === pressedKey)) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        handler(event);
      }
    },
    [key, handler, preventDefault, stopPropagation, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, enabled]);
}

/**
 * Custom hook for keyboard shortcuts with modifier keys
 */
export function useKeyboardShortcut(
  shortcut: {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  },
  handler: KeyboardEventHandler,
  options: UseKeyboardOptions = {}
) {
  const { preventDefault = true, stopPropagation = true, enabled = true } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const {
        key: targetKey,
        ctrl = false,
        alt = false,
        shift = false,
        meta = false,
      } = shortcut;

      const keyMatches = event.key.toLowerCase() === targetKey.toLowerCase();
      const ctrlMatches = event.ctrlKey === ctrl;
      const altMatches = event.altKey === alt;
      const shiftMatches = event.shiftKey === shift;
      const metaMatches = event.metaKey === meta;

      if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        handler(event);
      }
    },
    [shortcut, handler, preventDefault, stopPropagation, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, enabled]);
}

/**
 * Common keyboard shortcuts
 */
export const KeyboardShortcuts = {
  ESCAPE: 'escape',
  ENTER: 'enter',
  SPACE: ' ',
  TAB: 'tab',
  ARROW_UP: 'arrowup',
  ARROW_DOWN: 'arrowdown',
  ARROW_LEFT: 'arrowleft',
  ARROW_RIGHT: 'arrowright',
  BACKSPACE: 'backspace',
  DELETE: 'delete',
  HOME: 'home',
  END: 'end',
  PAGE_UP: 'pageup',
  PAGE_DOWN: 'pagedown',
} as const;
