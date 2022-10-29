import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Select from "react-select";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getCoinList } from "./redux/CoinListSlice";
import { Button } from "@material-ui/core";
import Modal from "@mui/material/Modal";
import ViewChart from "./ViewChart";

export default function MainPage() {
  const [WalletBalance, setWalletBalance] = useState(50001);
  const [open, setOpen] = useState(false);
  const [CryptoID, setCryptoID] = useState("");
  const [CoinNames, setCoinNames] = useState({
    Bitcoin: 13000,
    Ethereum: 12000,
    BNB: 25000,
    Tether: 1,
  });

  const [Rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const { CoinListData, Error } = useSelector((state) => state.CoinList);

  useEffect(() => {
    dispatch(getCoinList());
  }, []);

  // useMemo / useCallback here
  useEffect(() => {
    var UpdatedArray = [];
    var rows = {};

    CoinListData &&
      CoinListData.map(
        (result, index) => (
          (rows = {
            ["id"]: index + 1,
            ["name"]: result.name,
            ["current_price"]: "$" + result.current_price,
            ["market_cap"]: "$" + result.market_cap,
            ["image"]: result.image,
            ["Crypto_id"]: result.id,
          }),
          // console.log("Result Data:", result.name),
          UpdatedArray.push(rows)
        )
      );
    // console.log("UpdatedArray", UpdatedArray);
    setRows(UpdatedArray);
  }, [CoinListData]);

  useEffect(() => {
    var sum = Object.values(CoinNames).reduce(
      (a, b) => parseFloat(a) + parseFloat(b)
    );
    setWalletBalance(sum.toFixed(2));
  }, [CoinNames]);

  const handleClick = (event, cellValues) => {
    var { name, current_price } = cellValues.row;
    current_price = parseFloat(current_price.replace("$", ""));
    current_price = current_price.toFixed(2);
    // current_price = Math.floor(current_price);
    console.log("buy", name, current_price);

    if (name in CoinNames) {
      setCoinNames((prevState) => ({
        ...prevState,
        [name]: (
          parseFloat(CoinNames[name]) + parseFloat(current_price)
        ).toFixed(2),
      }));
    } else {
      setCoinNames((prevState) => ({
        ...prevState,
        [name]: parseFloat(current_price).toFixed(2),
      }));
    }
  };

  const handleSellClick = (event, cellValues) => {
    var { name, current_price } = cellValues.row;
    current_price = parseFloat(current_price.replace("$", ""));
    console.log("sell", name, current_price);

    if (name in CoinNames) {
      if (CoinNames[name] > parseFloat(0)) {
        setCoinNames((prevState) => ({
          ...prevState,
          [name]: (
            parseFloat(CoinNames[name]) - parseFloat(current_price)
          ).toFixed(2),
        }));
      }
    }
  };

  // const handleOpen = useCallback((event, cellValues) => {
  //   console.log("ChartJS", cellValues.row.Crypto_id);
  //   if (JSON.stringify(CryptoID) !== JSON.stringify(cellValues.row.Crypto_id)) {
  //     setCryptoID(cellValues.row.Crypto_id);
  //     setOpen(true);
  //   }

  //   // setCryptoID(cellValues.row.Crypto_id);
  //   // setOpen(true);
  // }, []);

  const handleOpen = (event, cellValues) => {
    console.log("ChartJS", cellValues.row.Crypto_id);
    // if (JSON.stringify(CryptoID) !== JSON.stringify(cellValues.row.Crypto_id)) {
    //   setCryptoID(cellValues.row.Crypto_id);
    //   setOpen(true);
    // }

    setCryptoID(cellValues.row.Crypto_id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const columns = [
    { field: "id", headerName: "#", width: 20 },
    { field: "name", headerName: "Coin Name", width: 200 },
    { field: "current_price", headerName: "Asset Price", width: 200 },
    { field: "market_cap", headerName: "Market Cap", width: 200 },
    {
      field: "Buy",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            Buy
          </Button>
        );
      },
    },
    {
      field: "Sell",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={(event) => {
              handleSellClick(event, cellValues);
            }}
          >
            Sell
          </Button>
        );
      },
    },

    {
      field: "Chart",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              onClick={(event) => {
                handleOpen(event, cellValues);
              }}
            >
              View Chart
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              children={
                <>
                  <ViewChart CryptoID={CryptoID} />
                </>
              }
            ></Modal>
          </>
        );
      },
    },
  ];

  return (
    <div
      className="main-container"
      style={{ color: "aliceblue", fontFamily: "monospace" }}
    >
      MainPage
      <div className="container1">
        <div
          //   style={{
          //     display: "flex",
          //     flexDirection: "row",
          //     justifyContent: "center",
          //     border: "1px solid white",
          //     padding: "25px",
          //   }}
          className="mini-container"
        >
          Wallet Balance - ${WalletBalance}
        </div>
        {/* <div className="mini-container">
          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
              <Typography
                style={{ color: "aliceblue", fontFamily: "monospace" }}
              >
                Search coins
              </Typography>
              <Select />
            </FormControl>
          </Box>
        </div> */}
        <div className="mini-container">
          <div
            style={{
              height: 300,
              width: "100%",
              color: "red",
              backgroundColor: "white",
            }}
          >
            <DataGrid
              rows={Rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </div>
        <div className="mini-container">
          <table style={{ width: "70%" }}>
            <tr>
              <th>Coin Name</th>
              <th>Quantity</th>
            </tr>
            {Object.keys(CoinNames).map((result, index) => (
              <tr key={index}>
                <td>{result}</td>
                <td>$ {CoinNames[result]}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
