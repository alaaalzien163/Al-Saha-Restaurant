import { useSyncExternalStore } from "react";

/**
 * Notifies React once, shortly after the store is subscribed to (i.e. after
 * mount). This is the trigger that lets `useSyncExternalStore` swap the server
 * snapshot for the client one without a `setState` inside an effect.
 */
function subscribeOnce(onStoreChange: () => void): () => void {
  const id = setTimeout(onStoreChange, 0);
  return () => clearTimeout(id);
}

const readTrue = () => true;
const readFalse = () => false;

/**
 * Whether the component has hydrated.
 *
 * React uses `getServerSnapshot` for the server render *and* for the hydration
 * render, then re-checks `getSnapshot` once it subscribes — giving us the
 * standard "flip after mount" guard with no hydration mismatch and no cascading
 * `setState` from an effect.
 *
 * Needed wherever a value can only be known in the browser (the stored theme,
 * the current query string/hash).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeOnce, readTrue, readFalse);
}

const readSearchAndHash = () =>
  `${window.location.search}${window.location.hash}`;
const readEmptySearchAndHash = () => "";

/**
 * The current `?query#hash` as seen by the browser.
 *
 * Returns `""` during SSR and for the hydration render, then the real value
 * immediately after mount — so links never disagree with the server-rendered
 * markup.
 */
export function useLocationSuffix(): string {
  return useSyncExternalStore(
    subscribeOnce,
    readSearchAndHash,
    readEmptySearchAndHash,
  );
}
