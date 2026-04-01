/**
 * Lightweight event bus for profile-related cross-feature signals.
 *
 * Usage:
 *   - In useDashboard: profileEvents.onProfileSaved(refresh)  → unsubscribe on cleanup
 *   - In useProfile:   profileEvents.emitProfileSaved()       → after successful save
 */

type Listener = () => void;

const listeners = new Set<Listener>();

export const profileEvents = {
  /** Register a callback to be called whenever a profile save succeeds. */
  onProfileSaved(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  /** Notify all registered listeners that the profile was saved. */
  emitProfileSaved(): void {
    for (const fn of listeners) {
      fn();
    }
  },
};
