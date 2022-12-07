import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const ISSERVER = typeof window === "undefined";

const { persistAtom } = recoilPersist({
  key: "recoil-persist-todos",
});

export const todosListState = atom({
  key: "todosListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const todosListSize = selector({
  key: "todosListSize",
  get: ({ get }) => get(todosListState).length,
});

export const tabsListState = atom({
  key: "tabsListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const tabsListSize = selector({
  key: "tabsListSize",
  get: ({ get }) => get(tabsListState).length,
});

export type TodoList = {
  createAt: string;
  key: string;
  tabId: string;
  todo: string;
};

export type TabList = {
  createAt: number | string;
  key: string;
  name: string;
  ordeBy: number;
};
