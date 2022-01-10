import { atom, selector } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
    key: 'recoil-persist-todos',
    storage: localStorage,
});

export const todosListState = atom({
    key: "todosListState",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const todosListSize = selector({
    key: "todosListSize",
    get: ({ get }) => (get(todosListState)).length
});