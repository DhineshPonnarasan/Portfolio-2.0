'use client';

import { useEffect, useState } from 'react';

/**
 * Tiny pub-sub store for the kbar search query.
 *
 * `kbar` only exposes a `setSearch` writer — there is no public reader. To
 * show a "no matches" empty state we mirror the query string in local
 * state via a module-scoped event bus. Both the search input and the
 * results panel call `useKbarQuery()` to subscribe to the same value.
 */

let currentQuery = '';
type Listener = (next: string) => void;
const listeners = new Set<Listener>();

const setQuery = (next: string) => {
    if (next === currentQuery) return;
    currentQuery = next;
    listeners.forEach((listener) => listener(next));
};

export function useKbarQuery(): string {
    const [value, setValue] = useState<string>(currentQuery);
    useEffect(() => {
        const listener: Listener = (next) => {
            setValue(next);
        };
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);
    return value;
}

export { setQuery };