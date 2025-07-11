import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// const BASE = "http://localhost/ecommerce_app/laravel_backend/public";
const BASE = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public";

const ShowCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ───────────────── fetch once ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE}/api/customers/${id}`);
        if (!res.ok) throw new Error("Customer not found");
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load customer.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading customer...</p>;
  if (error)   return <p className="text-danger">{error}</p>;

  return (
    <>
      {/* Header & actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold" style={{ color: "#034158" }}>
          Customer Details
        </h2>
        <div className="d-flex gap-2">
          <Link
            to={`customer/editcustomer/${id}`}
            className="btn2"
            title="Edit Customer"
          >
            <BorderColorOutlinedIcon /> &nbsp; Edit
          </Link>
          <Link
            to="customer/listcustomer"
            className="btn3 btn btn-outline-secondary"
          >
            <ArrowBackIosNewIcon fontSize="small" /> &nbsp; Back
          </Link>
        </div>
      </div>
      <hr />

      {/* Card with customer info */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="fw-bold mb-3 text-center">{customer.name}</h2>

          <p>
            <strong>Email:</strong> {customer.email || "-"}
          </p>
            <p>
            <strong>Phone no:</strong> {customer.phone || "-"}
          </p>
          <p>
            <strong>Status:</strong> {customer.status}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {customer.address ? customer.address : "(No address)"}
          </p>

          {/* Timestamps */}
          {customer.created_at && (
            <p className="text-muted mb-0">
              <small>Created: {customer.created_at}</small>
            </p>
          )}
          {customer.updated_at && (
            <p className="text-muted">
              <small>Updated: {customer.updated_at}</small>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowCustomer;
