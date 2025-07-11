import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ShowWarehouse = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  /* ──────────────────────────────
     Fetch warehouse once
     ────────────────────────────── */
  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const res = await fetch(
          // `http://localhost/ecommerce_app/laravel_backend/public/api/warehouses/${id}`
          `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/warehouses/${id}`
        );
        if (!res.ok) throw new Error("Warehouse not found");
        const data = await res.json();
        setWarehouse(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load warehouse.");
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [id]);

  if (loading) return <p>Loading warehouse...</p>;
  if (error)   return <p className="text-danger">{error}</p>;

  return (
    <>
      {/* Heading & actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Warehouse Details</h2>
        <div className="d-flex gap-2">
          <Link
            to={`/warehouse/editwarehouse/${id}`}
            className="btn2"
            title="Edit Warehouse"
          >
            <BorderColorOutlinedIcon /> &nbsp; Edit
          </Link>
          <Link
            to="/warehouse/listwatehouse"
            className="btn3 btn btn-outline-secondary"
          >
            <ArrowBackIosNewIcon fontSize="small" /> &nbsp; Back
          </Link>
        </div>
      </div>
      <hr />

      {/* Card with warehouse info */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-center">{warehouse.name}</h4>

          <p>
            <strong>Location:</strong> {warehouse.location || "-"}
          </p>

          {/* Timestamps (optional) */}
          {warehouse.created_at && (
            <p className="text-muted mb-0">
              <small>Created: {warehouse.created_at}</small>
            </p>
          )}
          {warehouse.updated_at && (
            <p className="text-muted">
              <small>Updated: {warehouse.updated_at}</small>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowWarehouse;
