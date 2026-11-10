import type { OperationalPriority } from "@/types/operations";

const OCCURRENCES_LIST_STATE_KEY = "mapeia-manager-occurrences-list-state";

const OCCURRENCES_LIST_STATE_EVENT =
  "mapeia-manager-occurrences-list-state-change";

export type OccurrencesListNavigationState = {
  query: string;
  statusKey: string | null;
  region: string | null;
  priority: OperationalPriority | null;
  scrollTop: number;
};

export const DEFAULT_OCCURRENCES_LIST_STATE: OccurrencesListNavigationState = {
  query: "",
  statusKey: null,
  region: null,
  priority: null,
  scrollTop: 0,
};

const DEFAULT_STATE_SNAPSHOT = JSON.stringify(DEFAULT_OCCURRENCES_LIST_STATE);

export function getOccurrencesListStateSnapshot(): string {
  if (typeof window === "undefined") {
    return DEFAULT_STATE_SNAPSHOT;
  }

  return (
    sessionStorage.getItem(OCCURRENCES_LIST_STATE_KEY) ?? DEFAULT_STATE_SNAPSHOT
  );
}

export function getOccurrencesListServerSnapshot(): string {
  return DEFAULT_STATE_SNAPSHOT;
}

export function parseOccurrencesListNavigationState(
  snapshot: string,
): OccurrencesListNavigationState {
  try {
    const parsed = JSON.parse(
      snapshot,
    ) as Partial<OccurrencesListNavigationState>;

    return {
      query: typeof parsed.query === "string" ? parsed.query : "",

      statusKey: typeof parsed.statusKey === "string" ? parsed.statusKey : null,

      region: typeof parsed.region === "string" ? parsed.region : null,

      priority:
        parsed.priority === "low" ||
        parsed.priority === "medium" ||
        parsed.priority === "high"
          ? parsed.priority
          : null,

      scrollTop:
        typeof parsed.scrollTop === "number"
          ? Math.max(0, parsed.scrollTop)
          : 0,
    };
  } catch {
    return DEFAULT_OCCURRENCES_LIST_STATE;
  }
}

export function saveOccurrencesListNavigationState(
  state: OccurrencesListNavigationState,
): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(OCCURRENCES_LIST_STATE_KEY, JSON.stringify(state));

  window.dispatchEvent(new Event(OCCURRENCES_LIST_STATE_EVENT));
}

export function updateOccurrencesListNavigationState(
  changes: Partial<OccurrencesListNavigationState>,
): void {
  const currentState = parseOccurrencesListNavigationState(
    getOccurrencesListStateSnapshot(),
  );

  saveOccurrencesListNavigationState({
    ...currentState,
    ...changes,
  });
}

export function subscribeToOccurrencesListState(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(OCCURRENCES_LIST_STATE_EVENT, callback);

  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(OCCURRENCES_LIST_STATE_EVENT, callback);

    window.removeEventListener("storage", callback);
  };
}