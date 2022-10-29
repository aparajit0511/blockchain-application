import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCoinList = createAsyncThunk(
  "CoinList/getCoinList",
  async () => {
    let response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    let json = await response.json();
    console.log("API Data:", json);
    return json;
  }
);

const CoinListSlice = createSlice({
  name: "todoList",
  initialState: {
    CoinListData: "",
    Error: false,
  },
  extraReducers: {
    [getCoinList.fulfilled]: (state, action) => {
      return {
        ...state,
        CoinListData: action.payload,
        Error: false,
      };
    },
    [getCoinList.pending]: (state) => {
      return {
        ...state,
        Error: false,
      };
    },
    [getCoinList.rejected]: (state) => {
      return {
        ...state,
        Error: true,
      };
    },
  },
});

export default CoinListSlice.reducer;
