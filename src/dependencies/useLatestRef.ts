import { MutableRefObject, useRef } from "react";

/**
 * React hook to persist any value between renders,
 * but keeps it up-to-date if it changes.
 *
 * @param value the value or function to persist
 */
export const useLatestRef = <T>(value: T) => {
  const ref = useRef<T | null>(null);
  ref.current = value;

  return ref as MutableRefObject<T>;
};
