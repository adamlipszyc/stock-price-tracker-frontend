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
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";

const AddStock = ({ fetchTrackedStocksCallback }) => {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState(0);
  const [date, setDate] = useState(dayjs());
  const [name, setName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0.0);
  const [isShown, setIsShown] = useState(false);

  const handleAddStock = async (e) => {
    try {
      console.log([symbol, name, shares, purchasePrice, date]);
      await axios.post("http://localhost:5000/api/stocks", {
        symbol,
        name,
        shares: parseInt(shares),
        purchase_price: parseFloat(purchasePrice),
        date,
      });

      setSymbol("");
      setName("");
      setShares(0);
      setPurchasePrice(0.0);
      setDate(dayjs());
      fetchTrackedStocksCallback();
      console.log("made it here");
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  //   const handleAddExpense = async (e) => {
  //     try {
  //       const response = await fetch("/api/expenses", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ category, amount, date, description }),
  //       });

  //       if (response.ok) {
  //         fetchExpensesCallBack();
  //         setCategory("");
  //         setAmount(null);
  //         setDate("");
  //         setDescription("");
  //       } else {
  //         throw new Error("Unable to add expense");
  //       }
  //     } catch (err) {
  //       console.error("Error adding expense:", err);
  //     }
  //   };

  return (
    <div className="add-expense-container">
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
                    <TextField
                      label="Symbol"
                      id="symbol"
                      name="symbol"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      size="small"
                      required
                    />
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
              <div>
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
              </div>
            </Box>
            <button type="submit">Add Stock</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddStock;
