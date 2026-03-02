"use client";

import { useCallback, useRef, useState } from "react";

export interface TypingState {
  cursor: number;
  charStates: (boolean | null)[];
  done: boolean;
}

interface TypingCallbacks {
  onCharCorrect?: () => void;
  onCharError?: () => void;
  onVerseDone?: () => void;
}

export function useTypingEngine(callbacks?: TypingCallbacks) {
  const [state, setState] = useState<TypingState>({
    cursor: 0,
    charStates: [],
    done: false,
  });

  const targetRef = useRef("");
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;
  const composingRef = useRef(false);
  const prevLenRef = useRef(0);

  const start = useCallback((target: string) => {
    const normalized = target.normalize("NFC");
    targetRef.current = normalized;
    composingRef.current = false;
    prevLenRef.current = 0;
    setState({
      cursor: 0,
      charStates: new Array(normalized.length).fill(null),
      done: false,
    });
  }, []);

  const handleInput = useCallback((inputValue: string) => {
    if (composingRef.current) return;

    const normalized = inputValue.normalize("NFC");
    const target = targetRef.current;
    const len = normalized.length;
    const prevLen = prevLenRef.current;

    setState((prev) => {
      if (prev.done) return prev;

      const newStates = [...prev.charStates];

      // Backspace: input got shorter
      if (len < prevLen) {
        for (let i = len; i < prevLen && i < target.length; i++) {
          newStates[i] = null;
        }
        prevLenRef.current = len;
        return { ...prev, cursor: Math.min(len, target.length), charStates: newStates };
      }

      // Forward: compare new characters
      for (let i = prevLen; i < len && i < target.length; i++) {
        const isCorrect = normalized[i] === target[i];
        newStates[i] = isCorrect;
        if (isCorrect) {
          callbacksRef.current?.onCharCorrect?.();
        } else {
          callbacksRef.current?.onCharError?.();
        }
      }

      const newCursor = Math.min(len, target.length);
      prevLenRef.current = len;

      // Check completion
      if (newCursor >= target.length) {
        callbacksRef.current?.onVerseDone?.();
        return { cursor: newCursor, charStates: newStates, done: true };
      }

      return { ...prev, cursor: newCursor, charStates: newStates };
    });
  }, []);

  const handleCompositionStart = useCallback(() => {
    composingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (inputValue: string) => {
      composingRef.current = false;
      handleInput(inputValue);
    },
    [handleInput],
  );

  const reset = useCallback(() => {
    const target = targetRef.current;
    composingRef.current = false;
    prevLenRef.current = 0;
    setState({
      cursor: 0,
      charStates: new Array(target.length).fill(null),
      done: false,
    });
  }, []);

  return { state, start, handleInput, handleCompositionStart, handleCompositionEnd, reset };
}
