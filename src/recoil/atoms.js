import { atom } from "recoil";

export const plansState = atom({
  key: "plansState",
  default: [],
});

export const boardListState = atom({
  key: "boardListState",
  default: [], // 기본값 설정
});

export const currentPostState = atom({
  key: "currentPostState",
  default: [],
});

export const pageState = atom({
  key: "pageState",
  default: 1,
});
