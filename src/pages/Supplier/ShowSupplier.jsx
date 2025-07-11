import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ShowSupplier = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ──────────────────────────────
     Fetch supplier once
     ────────────────────────────── */
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await fetch(
          // `http://localhost/ecommerce_app/laravel_backend/public/api/suppliers/${id}`
          `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/suppliers/${id}`
        );
        if (!res.ok) throw new Error("Supplier not found");
        const data = await res.json();
        setSupplier(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load supplier.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  if (loading) return <p>Loading supplier...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      {/* Heading & actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>
          Supplier Details
        </h2>
        <div className="d-flex gap-2">
          <Link
            to={`/supplier/editsupplier/${id}`}
            className="btn2"
            title="Edit Supplier"
          >
            <BorderColorOutlinedIcon /> &nbsp; Edit
          </Link>
          <Link
            to="/supplier/listsupplier"
            className="btn3 btn btn-outline-secondary"
          >
            <ArrowBackIosNewIcon fontSize="small" /> &nbsp; Back
          </Link>
        </div>
      </div>
      <hr />

      {/* Card with supplier info */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="fw-bold mb-3 text-center">{supplier.name}</h2>
<p>
            <strong>Company Name:</strong>{" "}
            {supplier.company_name ? supplier.company_name : "(No address)"}
          </p>
          <p>
            <strong>Phone:</strong> {supplier.phone || "-"}
          </p>
          <p>
            <strong>Email:</strong> {supplier.email || "-"}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {supplier.address ? supplier.address : "(No address)"}
          </p>

          {/* Timestamps (optional) */}
          {supplier.created_at && (
            <p className="text-muted mb-0">
              <small>Created: {supplier.created_at}</small>
            </p>
          )}
          {supplier.updated_at && (
            <p className="text-muted">
              <small>Updated: {supplier.updated_at}</small>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowSupplier;
