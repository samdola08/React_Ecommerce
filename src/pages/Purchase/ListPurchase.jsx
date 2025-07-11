import React, { useEffect, useState, useMemo } from "react";
import Pagination from "../../components/Pagination";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";

// const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public/api";
const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
const PER_PAGE = 5;

const paymentFlow = ["due", "partial", "paid"];
const statusFlow = ["pending", "completed", "cancelled"];
const next = (arr, cur) => arr[(arr.indexOf(cur) + 1) % arr.length];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ListPurchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPurchases();
  }, []);

const fetchPurchases = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${BASE_URL}/purchases`);
    const data = await res.json();
    const list = data.purchases || data || [];

    // Sort by id descending (newest first)
    list.sort((a, b) => b.id - a.id);

    setPurchases(list);
  } catch (err) {
    console.error("Error fetching purchases:", err);
  } finally {
    setLoading(false);
  }
};

  const updateRow = async (id, field, newVal) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: newVal } : p))
    );
    try {
      await fetch(`${BASE_URL}/purchases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newVal }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filter and sort with useMemo for performance and correctness
  const filtered = useMemo(() => {
    return purchases
      .filter((p) =>
        p.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.purchase_date);
        const dateB = new Date(b.purchase_date);
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
      });
  }, [purchases, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = (currentPage - 1) * PER_PAGE;
  const currentPurchases = filtered.slice(start, start + PER_PAGE);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete purchase: ${name}?`))
      return;

    try {
      const res = await fetch(`${BASE_URL}/purchases/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPurchases((prev) => prev.filter((p) => p.id !== id));
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
        <h2 style={{ fontWeight: "bold", color: "#034158", margin: 0 }}>
          Purchase List
        </h2>
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
          <Typography color="text.primary">Purchases</Typography>
        </Breadcrumbs>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by reference..."
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
                  <th>Supplier</th>
                  <th>Reference</th>
                  <th>Purchase No</th>
                  <th>Invoice Number</th>
                  <th>Purchase Date</th>
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
                    <td colSpan="12" style={{ textAlign: "center", padding: 20 }}>
                      Loading...
                    </td>
                  </tr>
                ) : currentPurchases.length === 0 ? (
                  <tr>
                    <td colSpan="12" style={{ textAlign: "center", padding: 20 }}>
                      No purchases found.
                    </td>
                  </tr>
                ) : (
                  currentPurchases.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.supplier_name || p.supplier?.name || "—"}</td>
                      <td>{p.reference}</td>
                      <td>{p.purchase_no}</td>
                      <td>{p.invoice_number}</td>
                      <td>{new Date(p.purchase_date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={`badge-btn ${p.payment_status}`}
                          onClick={() =>
                            updateRow(
                              p.id,
                              "payment_status",
                              next(paymentFlow, p.payment_status)
                            )
                          }
                        >
                          {cap(p.payment_status)}
                        </button>
                      </td>
                      <td>${(+p.total_amount).toFixed(2)}</td>
                      <td>${(+p.paid_amount).toFixed(2)}</td>
                      <td>${(+p.due_amount).toFixed(2)}</td>
                      <td>
                        <button
                          className={`badge-btn ${p.status}`}
                          onClick={() =>
                            updateRow(p.id, "status", next(statusFlow, p.status))
                          }
                        >
                          {cap(p.status)}
                        </button>
                      </td>
                      <td className="d-flex gap-2">
                        <RouterLink
                          to={`/purchase/editpurchase/${p.id}`}
                          className="icon-edit"
                          title="Edit"
                        >
                          <BorderColorOutlinedIcon />
                        </RouterLink>
                        <RouterLink
                          to={`/purchase/invoicepurchase/${p.id}`}
                          className="icon-invoice"
                        >
                          <ReceiptOutlinedIcon />
                        </RouterLink>
                        <RouterLink
                          to={`/purchase/showpurchase/${p.id}`}
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

export default ListPurchase;
