import { selector } from "recoil";
import axios from "axios";

import { plansState } from "./atoms";

export const filteredPlansSelector = selector({
  key: "filteredPlansSelector",
  get: ({ get }) => {
    const plans = get(plansState);
    return plans.filter((plan) => plan.type === "Self").slice(0, 8);
  },
});

export const fetchPlans = selector({
  key: "fetchPlans",
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
