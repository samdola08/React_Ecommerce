import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const ShowStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

//   const imgBase = "http://localhost/ecommerce_app/laravel_backend/public/img/Product/";
  const imgBase = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Product/";

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // const res = await fetch("http://localhost/ecommerce_app/laravel_backend/public/api/stocks");
        const res = await fetch("http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/stocks");
        if (!res.ok) throw new Error("Failed to fetch stock data.");
        const data = await res.json();
        setStocks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) return <p>Loading stock...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <Breadcrumbs separator="›" aria-label="breadcrumb" className="mb-4">
        <MUILink component={RouterLink} to="/" underline="hover" color="inherit">
          <HomeOutlinedIcon fontSize="small" /> Dashboard
        </MUILink>
        <Typography color="text.primary">Stock List</Typography>
      </Breadcrumbs>

      <div className="card">
        <div className="card-body">
          <h3 className="mb-4" style={{ color: "#034158" }}><Inventory2OutlinedIcon /> Stock Entries</h3>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Warehouse</th>
                <th>Type</th>
                <th>Qty In</th>
                <th>Qty Out</th>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, i) => {
                let img = "https://via.placeholder.com/80?text=No+Image";
                try {
                  if (stock.product?.img) {
                    const parsed = JSON.parse(stock.product.img);
                    if (Array.isArray(parsed)) {
                      img = imgBase + parsed[0];
                    } else {
                      img = imgBase + stock.product.img;
                    }
                  }
                } catch { }

                return (
                  <tr key={stock.id}>
                    <td>
                      <img src={img} alt="product" width="60" height="60"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/80?text=No+Image";
                        }}
                        style={{ borderRadius: "4px", border: "2px dashed #ccc" }}
                      />
                    </td>
                    <td>{stock.product?.name || "-"}</td>
                    <td>{stock.warehouse || "-"}</td>
                    <td>
                      <span className={`badge ${stock.type === "purchase" ? "bg-primary" : "bg-secondary"}`}>
                        {stock.type}
                      </span>
                    </td>
                    <td>{stock.quantity_in}</td>
                    <td>{stock.quantity_out}</td>
                    <td>{new Date(stock.stock_date).toLocaleString()}</td>
                    <td>{stock.note || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowStock;
