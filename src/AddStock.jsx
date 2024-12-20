import React, { useState } from "react";
import "./AddStock.css";
import axios from "axios";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  TextField,
  OutlinedInput,
  FormLabel,
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";

const AddStock = ({ fetchTrackedStocksCallback, allStockData }) => {
  const [stock, setStock] = useState(null);
  const [stockInputValue, setStockInputValue] = useState("");
  const [shares, setShares] = useState(0);
  const [date, setDate] = useState(dayjs());
  const [purchasePrice, setPurchasePrice] = useState(0.0);
  const [isShown, setIsShown] = useState(false);

  const handleAddStock = async (e) => {
    try {
      console.log(stock);

      console.log([stock.symbol, stock.name, shares, purchasePrice, date]);

      await axios.post("http://localhost:5000/api/stocks", {
        symbol: stock.symbol,
        name: stock.name,
        shares: parseInt(shares),
        purchase_price: parseFloat(purchasePrice),
        date,
      });

      setStock(null);
      setShares(0);
      setPurchasePrice(0.0);
      setDate(dayjs());
      fetchTrackedStocksCallback();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  return (
    <div className="add-stock-container">
      <button onClick={() => setIsShown(!isShown)}>
        {!isShown ? "Add" : "Close"}
      </button>
      {isShown && (
        <>
          <form onSubmit={handleAddStock}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div className="category-container">
                <Box sx={{ minWidth: 300 }}>
                  <FormControl sx={{ minWidth: 300, m: 1, ml: 0 }}>
                    <Autocomplete
                      options={allStockData}
                      getOptionLabel={(option) =>
                        `${option.symbol} - ${option.name}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Search Stocks" required />
                      )}
                      value={stock}
                      inputValue={stockInputValue}
                      onInputChange={(event, newInputValue) =>
                        setStockInputValue(newInputValue)
                      }
                      onChange={(event, newValue) => setStock(newValue)}
                    />

                    {/* <TextField
                      label="Symbol"
                      id="symbol"
                      name="symbol"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      size="small"
                      required
                    /> */}
                  </FormControl>
                </Box>
              </div>
              <div>
                <FormControl
                  size="small"
                  sx={{ m: 1, ml: 0, minWidth: 300 }}
                  required
                  margin="normal"
                >
                  <InputLabel htmlFor="shares">Number of shares</InputLabel>
                  <OutlinedInput
                    id="shares"
                    type={"number"}
                    name="shares"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    label="Number of shares"
                  />
                </FormControl>
              </div>
              <div>
                <FormControl
                  size="small"
                  sx={{ m: 1, ml: 0, minWidth: 300 }}
                  required
                  margin="normal"
                >
                  <InputLabel htmlFor="purchase_price">
                    Purchase Price
                  </InputLabel>
                  <OutlinedInput
                    id="purchase_price"
                    type={"number"}
                    name="purchase_price"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start" sx={{ marginRight: 1 }}>
                        <CurrencyPoundIcon />
                      </InputAdornment>
                    }
                    label="Purchase Price"
                  />
                </FormControl>
              </div>
              <FormControl sx={{ m: 1, ml: 0, minWidth: 300 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    required
                  />
                </LocalizationProvider>
              </FormControl>
              {/* <div>
                <FormControl sx={{ m: 1, ml: 0, minWidth: 300 }}>
                  <TextField
                    label="Name"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                  />
                </FormControl>
              </div> */}
            </Box>
            <button type="submit">Add Stock</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddStock;
