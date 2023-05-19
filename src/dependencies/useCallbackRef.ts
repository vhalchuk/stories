import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * Always returns the same reference to the callback,
 * but the callback stays up-to-date.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCallbackRef = <T extends (...args: any[]) => any>(
  callback: T | undefined
): T => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => callbackRef.current?.(...args)) as T, []);
};
