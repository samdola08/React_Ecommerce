import React, { useEffect, useState, useMemo } from "react";
import Pagination from "../../components/Pagination";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { Link } from "react-router-dom";

// const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public/api";
const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
const PER_PAGE = 5;

// Allowed delivery statuses in your flow order
const deliveryStatusFlow = ["pending", "in_transit", "delivered", "cancelled"];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ListDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/deliveries`);
      const data = await res.json();
      const list = data.data || data || [];
      list.sort((a, b) => b.id - a.id);
      setDeliveries(list);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get next status in the flow
  const nextStatus = (current) => {
    const index = deliveryStatusFlow.indexOf(current);
    return deliveryStatusFlow[(index + 1) % deliveryStatusFlow.length];
  };

  // Update status via API and update UI state
  const updateStatus = async (id, currentStatus) => {
    const newStatus = nextStatus(currentStatus);

    try {
      const res = await fetch(`${BASE_URL}/deliveries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error:", errorData);
        alert(errorData.message || "Failed to update status");
        return;
      }

      // Update delivery in state
      setDeliveries((prev) =>
        prev.map((d) => (d.id === id ? { ...d, delivery_status: newStatus } : d))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  const filtered = useMemo(() => {
    return deliveries
      .filter((d) =>
        d.delivery_person?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));
  }, [deliveries, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = (currentPage - 1) * PER_PAGE;
  const currentDeliveries = filtered.slice(start, start + PER_PAGE);

  // Status badge color helper
  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "in_transit":
        return "blue";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
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
          <Typography color="text.primary">Deliveries</Typography>
        </Breadcrumbs>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold" style={{ color: "#034158" }}>
          List Of Deliveries
        </h2>
        <Link to="/delivery/createdelivery" className="btn2">
          <UploadOutlinedIcon />
          &nbsp;Add Delivery
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by delivery person..."
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
                  <th>Order ID</th>
                  <th>Delivery Person</th>
                  <th>Company</th>
                  <th>Delivery Date</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>
                      Loading...
                    </td>
                  </tr>
                ) : currentDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>
                      No deliveries found.
                    </td>
                  </tr>
                ) : (
                  currentDeliveries.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.order_id}</td>
                      <td>{d.delivery_person}</td>
                      <td>{d.delivery_company || "—"}</td>
                      <td>{new Date(d.delivery_date).toLocaleString()}</td>
                      <td>{d.delivery_note || "—"}</td>
                      <td>
                        <button
                          onClick={() => updateStatus(d.id, d.delivery_status)}
                          style={{
                            backgroundColor: statusColor(d.delivery_status),
                            border: "none",
                            padding: "6px 12px",
                            color: "white",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          title="Click to change status"
                        >
                          {cap(d.delivery_status || "pending")}
                        </button>
                      </td>
                      <td>
                        <RouterLink
                          to={`/order/showdelivery/${d.order_id}`}
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

export default ListDelivery;
