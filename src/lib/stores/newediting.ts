import type { IBoundings, IChoice, IVariable } from '$lib/types';
import type { IFrameCreate } from '$lib/types/editing';
import { writable } from 'svelte/store';

type IAction = 'movingFrame' | 'view' | 'binding' | 'movingArea' | 'adding';

interface IFrame {
	frameId: number;
	choices: IChoice[];
	text: string | null;
	imageId: string | null;
}

interface IWorkspaceFrame extends IBoundings {
	frameId: number;
	rotated: boolean;
	hidden: boolean;
	title: string;
}

export const selectedFrameStore = writable<number>();
export const movingFrameStore = writable<number>();

export const oneDirectionModeStore = writable<boolean | null>();
export const activeActionStore = writable<IAction>('view');
export const removeModeStore = writable<boolean>(false);
export const panelFrameStore = writable<IFrameCreate>();
export const framesDataStore = writable<IFrame[]>([]);
export const workspaceDataStore = writable<IWorkspaceFrame[]>([]);
export const variablesStore = writable<IVariable[]>([]);
