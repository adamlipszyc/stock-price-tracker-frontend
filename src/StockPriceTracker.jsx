import React, { useState, useEffect } from "react";
import axios from "axios";
import StockTimeSeriesChart from "./StockTimeSeriesChart";
import CircularProgress from "@mui/material/CircularProgress";
import AddStock from "./AddStock";

const StockPriceTracker = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState(new Set());
  const [profitLoss, setProfitLoss] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    fetchTrackedStocks();
  }, []);

  // Fetch all tracked stocks from the database
  const fetchTrackedStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks");
      const stockList = response.data.stocks;
      setStocks(stockList);
      // Fetch profit/loss for each stock after loading the stocks
      Promise.all(stockList.map((stock) => fetchProfitLoss(stock)))
        .then(() => setAllLoaded(true))
        .catch((err) =>
          console.error("Could not fetch one or more stocks data", err)
        );
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  // Fetch profit/loss for a single stock
  const fetchProfitLoss = async (stock) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stock-price/${stock.symbol}`
      );
      const profitLoss = (
        (response.data.price - stock.purchase_price) *
        stock.shares
      ).toFixed(2);
      setProfitLoss((prev) => ({
        ...prev,
        [stock.symbol]: profitLoss,
      }));
    } catch (error) {
      console.error("Error fetching profit/loss:", error);
    }
  };

  const toggleStock = (stock) => {
    const copy = new Set(selectedStocks);
    if (selectedStocks.has(stock)) {
      copy.delete(stock);
    } else {
      copy.add(stock);
    }
    setSelectedStocks(copy);
  };

  return (
    <div>
      <h1>Stock Price Tracker</h1>
      <AddStock fetchTrackedStocksCallback={fetchTrackedStocks} />
      {/* Displaying each stock's details and profit/loss */}
      {allLoaded ? (
        <ul>
          {stocks.map((stock) => (
            <li key={stock.id}>
              {stock.name} ({stock.symbol}) -
              <span>
                Shares: {stock.shares}, Purchase Price: ${stock.purchase_price}
              </span>
              {console.log(profitLoss[stock.symbol])}
              {profitLoss[stock.symbol] && (
                <span> - Current P/L: ${profitLoss[stock.symbol]}</span>
              )}
              <button onClick={() => toggleStock(stock.symbol)}>
                View Chart
              </button>
              {selectedStocks.has(stock.symbol) && (
                <StockTimeSeriesChart symbol={stock.symbol} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default StockPriceTracker;
