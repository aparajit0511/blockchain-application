import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { mockComponent } from "react-dom/test-utils";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import moment from "moment";

const ViewChart = (props) => {
  //   var moment = require("moment");
  const { CryptoID } = props;
  const [ChartData, setChartData] = useState("");
  const [Prices, setPrices] = useState([]);

  useEffect(() => {
    fetchCoinData(CryptoID);
  }, [CryptoID]);

  async function fetchCoinData(CryptoID) {
    console.log("Function", CryptoID);
    const response = await fetch(
      " https://api.coingecko.com/api/v3/coins/" +
        `${CryptoID}` +
        "/market_chart?vs_currency=usd&days=14"
    )
      .then((res) => res.json())
      .then((result) => setChartData(result));
  }

  console.log("ViewChart", ChartData, CryptoID);

  useEffect(() => {
    var _Prices;
    if (ChartData && ChartData.prices) _Prices = ChartData.prices.slice(1, 13);
    setPrices(_Prices);
  }, [ChartData]);
  //   console.log(
  //     "Prices",
  //    Prices
  //   );

  var LineChart = {};

  // useEffect(() => {
  LineChart = {
    labels:
      Prices &&
      Object.keys(Prices).map((result) => moment(result).format("DD MMM YYYY")),
    datasets: [
      {
        label: "Prices from Jan 00 to Nov 01",
        data: Prices && Object.values(Prices).map((result) => result),

        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  // }, [ChartData]);

  var LineChart_Prices = {};

  //   ChartData && ChartData.map((result) => console.log("Linechart", result));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Box sx={style}>
      <Line data={LineChart} />

      <Typography id="modal-modal-title" variant="h6" component="h2">
        Graph for {CryptoID}
      </Typography>
    </Box>
  );
};

export default ViewChart;
