import { selector } from "recoil";
import axios from "axios";

import { plansState } from "./atoms";
import { boardListState } from "./atoms";

export const fetchBoardListSelector = selector({
  key: "fetchBoardListSelector",
  get: async ({ get }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/post`);
      return [...response.data].reverse().slice(0, 5);
    } catch (error) {
      throw error;
    }
  },
  set: ({ set }, newValue) => {
    set(boardListState, newValue);
  },
});

export const filteredPlansSelector = selector({
  key: "filteredPlansSelector",
  get: ({ get }) => {
    const plans = get(plansState);
    return plans.filter((plan) => plan.type === "Self").slice(0, 8);
  },
});

export const fetchPlansNew = selector({
  key: "fetchPlansNew",
  get: async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/plan/new`
      );
      return [...response.data].reverse();
    } catch (error) {
      console.log("정보를 불러오는 데에 실패하였습니다.");
      return [];
    }
  },
});
