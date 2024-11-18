import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
);

const StockTimeSeriesChart = ({ symbol }) => {
  const [chartData, setChartData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stock-time-series/${symbol}`
      );
      const timeSeries = response.data["Time Series (Daily)"];

      // const timeSeries = data["Time Series (Daily)"];
      console.log(timeSeries);

      const labels = Object.keys(timeSeries);
      const closingPrices = Object.values(timeSeries).map((value) =>
        parseFloat(value["4. close"])
      );
      const openingPrices = Object.values(timeSeries).map((value) =>
        parseFloat(value["1. open"])
      );
      const highestPrices = Object.values(timeSeries).map((value) =>
        parseFloat(value["2. high"])
      );
      const lowestPrices = Object.values(timeSeries).map((value) =>
        parseFloat(value["3. low"])
      );
      console.log(closingPrices);
      console.log(openingPrices);
      console.log(highestPrices);
      console.log(lowestPrices);

      setChartData({
        labels,
        datasets: [
          {
            label: `${symbol} Open Stock Price`,
            data: openingPrices,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            pointRadius: 1,
            pointHoverRadius: 5,
            fill: true,
          },
          {
            label: `${symbol} Close Stock Price`,
            data: closingPrices,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 1,
            pointRadius: 1,
            pointHoverRadius: 5,
            fill: true,
          },
          {
            label: `${symbol} High Stock Price`,
            data: highestPrices,
            borderColor: "rgba(255, 206, 86, 1)",
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderWidth: 1,
            pointRadius: 1,
            pointHoverRadius: 5,
            fill: true,
          },
          {
            label: `${symbol} Low Stock Price`,
            data: lowestPrices,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 1,
            pointRadius: 1,
            pointHoverRadius: 2,
            fill: true,
          },
        ],
      });
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day", // Set the unit to day
          displayFormats: {
            day: "MMM D", // Format for the x-axis labels (e.g., "Oct 1, 2024")
          },
        },
        title: {
          display: true,
          text: "Date", // Title for the x-axis
        },
      },
      y: {
        beginAtZero: false, // Adjust y-axis based on your data
        title: {
          display: true,
          text: "Price (USD)",
        },
      },
    },
  };

  return (
    <>
      {loaded ? (
        <div>
          <h3>{symbol} Stock Price Chart (Last 5 months)</h3>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default StockTimeSeriesChart;
