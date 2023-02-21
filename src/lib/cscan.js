import { writable } from 'svelte/store';

export const cscanstate = writable([null,null,"fail"])
export const cverifiedstate = writable([null,"fail"])
export const unhidebtn = writable(true)