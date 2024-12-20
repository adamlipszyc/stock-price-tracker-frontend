import React, { useState, useEffect } from "react";
import axios from "axios";
import StockItem from "./StockItem";
import CircularProgress from "@mui/material/CircularProgress";
import AddStock from "./AddStock";
import { List } from "@mui/material";
import SearchBar from "./SearchBar";

const StockPriceTracker = () => {
  const [stocks, setStocks] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [selectedStocks, setSelectedStocks] = useState(new Set());
  const [profitLoss, setProfitLoss] = useState({});
  const [currentPrices, setCurrentPrices] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);
  const [allStockData, setAllStockData] = useState([]);

  useEffect(() => {
    fetchStockPrerequisites();
    fetchTrackedStocks();
  }, []);

  const fetchStockPrerequisites = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/stocks/listing"
      );
      const allStockData = response.data.info;
      allStockData.map((entry) => {
        entry.name, entry.symbol;
      });
      setAllStockData(allStockData);
    } catch (error) {
      console.error("Error grabbing all stock symbols and other info", err);
    }
  };

  // Fetch all tracked stocks from the database
  const fetchTrackedStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks");
      const stockList = response.data.stocks;

      // Fetch profit/loss for each stock after loading the stocks
      Promise.all(stockList.map((stock) => fetchProfitLoss(stock)))
        .then(() => {
          setStocks(stockList);
          setAllLoaded(true);
        })
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
      setCurrentPrices((prev) => ({
        ...prev,
        [stock.symbol]: response.data.price,
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

  const handleDeleteStock = async (stockId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/stocks/${stockId}`
      );
      fetchTrackedStocks();
    } catch (error) {
      console.error("Error deleting stock: ", error);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "10px" }}>Stock Price Tracker</h1>
      <SearchBar value={searchVal} setValue={setSearchVal} />
      <AddStock
        fetchTrackedStocksCallback={fetchTrackedStocks}
        allStockData={allStockData}
      />
      {/* Displaying each stock's details and profit/loss */}
      {allLoaded ? (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {stocks
            .filter(
              (stock) =>
                stock.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                stock.symbol.toLowerCase().includes(searchVal.toLowerCase())
            )
            .map((stock) => (
              <StockItem
                key={stock.id}
                id={stock.id}
                name={stock.name}
                symbol={stock.symbol}
                pnl={profitLoss[stock.symbol]}
                current_price={currentPrices[stock.symbol]}
                shares={stock.shares}
                purchase_price={stock.purchase_price}
                handleDeleteStock={handleDeleteStock}
                selectedStocks={selectedStocks}
                toggleStock={toggleStock}
              />
            ))}
        </List>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default StockPriceTracker;
