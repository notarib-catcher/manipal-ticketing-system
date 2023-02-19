import { writable } from 'svelte/store';

export const deetstore = writable([null,null,null]);
export const kioskTKN = writable("")
export const kioskName = writable("")
export const serverIP = writable("")