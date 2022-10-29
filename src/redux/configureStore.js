import { configureStore } from "@reduxjs/toolkit";
import CoinListSlice from "./CoinListSlice";

const store = configureStore({
  reducer: {
    CoinList: CoinListSlice,
  },
});

export default store;
