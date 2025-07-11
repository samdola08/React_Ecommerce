import React, { useEffect, useState, useMemo } from "react";
import Pagination from "../../components/Pagination";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { Link } from "react-router-dom";
import "./create.css";



// const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public/api";
const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
const PER_PAGE = 5;

const paymentFlow = ["unpaid", "partial", "paid", "refunded"];
const statusFlow = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const next = (arr, cur) => arr[(arr.indexOf(cur) + 1) % arr.length];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      const data = await res.json();
      const list = data.data || data || [];
      list.sort((a, b) => b.id - a.id);
      setOrders(list);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRow = async (id, field, newVal) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: newVal } : o))
    );
    try {
      await fetch(`${BASE_URL}/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newVal }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    return orders
      .filter((o) =>
        o.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.order_date);
        const dateB = new Date(b.order_date);
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
      });
  }, [orders, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = (currentPage - 1) * PER_PAGE;
  const currentOrders = filtered.slice(start, start + PER_PAGE);

  const handleDelete = async (id, orderNo) => {
    if (!window.confirm(`Are you sure you want to delete order: ${orderNo}?`))
      return;

    try {
      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <MUILink
            component={RouterLink}
            to="/"
            sx={{ display: "flex", alignItems: "center" }}
            underline="hover"
            color="inherit"
          >
            <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </MUILink>
          <Typography color="text.primary">Orders</Typography>
        </Breadcrumbs>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold" style={{ color: "#034158" }}>
          List Of Orders
        </h2>
        <Link to="/order/createorder" className="btn2">
          <UploadOutlinedIcon />
          &nbsp;Add Order
        </Link>
      </div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search by order number..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          width: "40%",
          padding: 8,
          marginBottom: 20,
          fontSize: 16,
          boxSizing: "border-box",
        }}
      />

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-table">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Order No</th>
                  <th>Order Date</th>
                  <th>Payment Status</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: 20 }}>
                      Loading...
                    </td>
                  </tr>
                ) : currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: 20 }}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer_name || o.customer?.name || "—"}</td>
                      <td>{o.order_no}</td>
                      <td>{new Date(o.order_date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={`badge-btn ${o.payment_status}`}
                          onClick={() =>
                            updateRow(
                              o.id,
                              "payment_status",
                              next(paymentFlow, o.payment_status)
                            )
                          }
                        >
                          {cap(o.payment_status)}
                        </button>
                      </td>
                      <td>৳{(+o.total_amount).toFixed(2)}</td>
                      <td>৳{(+o.paid_amount).toFixed(2)}</td>
                      <td>৳{(+o.due_amount).toFixed(2)}</td>
                      <td>
                        <button
                          className={`badge-btn ${o.status}`}
                          onClick={() =>
                            updateRow(
                              o.id,
                              "status",
                              next(statusFlow, o.status)
                            )
                          }
                        >
                          {cap(o.status)}
                        </button>
                      </td>
                      <td className="d-flex gap-2">
                        <RouterLink
                          to={`/order/editorder/${o.id}`}
                          className="icon-edit"
                          title="Edit"
                        >
                          <BorderColorOutlinedIcon />
                        </RouterLink>
                        <RouterLink
                          to={`/order/orderinvoice/${o.id}`}
                          className="icon-invoice"
                          title="Invoice"
                        >
                          <ReceiptOutlinedIcon />
                        </RouterLink>
                        <RouterLink
                          to={`/order/showorder/${o.id}`}
                          className="icon-view"
                          title="View"
                        >
                          <VisibilityOutlinedIcon />
                        </RouterLink>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ListOrder;
