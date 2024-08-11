import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

let pbHost = import.meta.env.VITE_PB_HOST || "/";
export const pb = new PocketBase(pbHost);

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
  console.log('auth changed', auth);
  currentUser.set(pb.authStore.model);
})
