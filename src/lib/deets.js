import { writable } from 'svelte/store';

export const tempinputstore = writable([null,null,null]);
export const kioskTKN = writable("")
export const kioskName = writable("")
export const serverIP = writable("")
export const kioskassignment = writable([null,null])
export const doassignmentagain = writable(false)