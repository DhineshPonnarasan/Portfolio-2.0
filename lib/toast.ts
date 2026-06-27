'use client';

import { useSyncExternalStore } from 'react';

export type ToastVariant = 'default' | 'success' | 'error' | 'info';

export interface ToastItem {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    durationMs?: number;
}

type Listener = () => void;

class ToastStore {
    private items: ToastItem[] = [];
    private listeners = new Set<Listener>();

    subscribe = (listener: Listener): (() => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    getSnapshot = (): ToastItem[] => this.items;

    push = (item: Omit<ToastItem, 'id'>) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const fullItem: ToastItem = { id, durationMs: 1600, variant: 'default', ...item };
        this.items = [...this.items, fullItem];
        this.emit();
        if (typeof window !== 'undefined') {
            window.setTimeout(() => this.dismiss(id), fullItem.durationMs ?? 1600);
        }
        return id;
    };

    dismiss = (id: string) => {
        this.items = this.items.filter((i) => i.id !== id);
        this.emit();
    };

    clear = () => {
        this.items = [];
        this.emit();
    };

    private emit() {
        this.listeners.forEach((l) => l());
    }
}

const store = new ToastStore();

export const toastStore = store;

export function useToasts(): ToastItem[] {
    return useSyncExternalStore(store.subscribe, store.getSnapshot, () => []);
}

export function toast(input: Omit<ToastItem, 'id'>): string {
    return store.push(input);
}
