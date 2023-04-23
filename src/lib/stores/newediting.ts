import type { IFrameCreate } from '$lib/types/editing';
import { writable } from 'svelte/store';

type IAction = 'movingFrame' | 'view' | 'binding' | 'movingArea' | 'adding';

export const selectedFrame = writable<number>();
export const oneDirectionMode = writable<boolean | null>();
export const activeAction = writable<IAction>('view');
export const removeMode = writable<boolean>(false);
export const panelFrame = writable<IFrameCreate>();
