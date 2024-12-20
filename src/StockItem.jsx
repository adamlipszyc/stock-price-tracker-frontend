import { useMemo, useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Collapse,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./StockItem.css";
import StockTimeSeriesChart from "./StockTimeSeriesChart";

const StockItem = ({
  id,
  name,
  symbol,
  shares,
  purchase_price,
  pnl,
  current_price,
  handleDeleteStock,
  selectedStocks,
  toggleStock,
}) => {
  const percentage_change = useMemo(() => {
    return ((current_price - purchase_price) / purchase_price).toFixed(2);
  }, [current_price, purchase_price]);

  const generateIcon = () => {
    if (percentage_change > 0) {
      return <ExpandLessIcon sx={{ color: "green", background: "none" }} />;
    } else {
      return <ExpandMoreIcon sx={{ color: "red" }} />;
    }
  };
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="stock-item-container"
      onClick={() => setExpanded(!expanded)}
    >
      <ListItem
        secondaryAction={
          <>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                e.preventDefault;
                handleDeleteStock(id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
      >
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: "background.paper" }}>
            {generateIcon()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={symbol} secondary={name} />
        <ListItemText
          primary={"%" + percentage_change}
          primaryTypographyProps={{
            fontSize: 18,
            color: percentage_change > 0 ? "green" : "red",
          }}
        />
      </ListItem>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        sx={{ height: "auto" }}
      >
        <ListItem sx={{ pl: 10, pt: 0 }}>
          <ListItemText
            secondary={"Number of shares: " + shares}
            secondaryTypographyProps={{ fontSize: 15 }}
          />
        </ListItem>
        <ListItem sx={{ pl: 10, pt: 0 }}>
          <ListItemText
            secondary={"Purchase price: $" + purchase_price}
            secondaryTypographyProps={{ fontSize: 15 }}
          />
        </ListItem>
        <ListItem sx={{ pl: 10, pt: 0 }}>
          <ListItemText
            secondary={"Current price: $" + current_price}
            secondaryTypographyProps={{ fontSize: 15 }}
          />
        </ListItem>
        <ListItem sx={{ pl: 10, pt: 0 }}>
          <ListItemText
            secondary={"PNL: $" + pnl}
            secondaryTypographyProps={{
              fontSize: 15,
              color: pnl > 0 ? "green" : "red",
            }}
          />
        </ListItem>
        {selectedStocks.has(symbol) && (
          <ListItem
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{ height: 500, width: 1000 }}
          >
            <StockTimeSeriesChart symbol={symbol} />
          </ListItem>
        )}
        <ListItem sx={{ justifyContent: "flex-end" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStock(symbol);
            }}
          >
            {selectedStocks.has(symbol) ? "Close chart" : "View Chart"}
          </button>
        </ListItem>
      </Collapse>
    </div>
  );
};

export default StockItem;
