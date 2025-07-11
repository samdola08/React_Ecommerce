import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ShowBrand = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public";
  const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public";

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/brands/${id}`);
        if (!res.ok) throw new Error("Brand not found");
        const data = await res.json();

        setBrand(data.brand ?? data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load brand.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading) return <p>Loading brand...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!brand) return null;

  const imageUrl = brand.image
    ? `${BASE_URL}/img/Brand/${brand.image}`
    : null;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Brand Details</h2>
        <div className="d-flex gap-2">
          <Link to={`/inventory/brand/editbrand/${id}`} className="btn2" title="Edit Brand">
            <BorderColorOutlinedIcon /> &nbsp; Edit
          </Link>
          <Link to="/inventory/brand/listbrand" className="btn3 btn btn-outline-secondary">
            <ArrowBackIosNewIcon fontSize="small" /> &nbsp; Back
          </Link>
        </div>
      </div>
      <hr />

      <div className="card shadow-sm">
        <div className="card-body text-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={brand.name}
              style={{ width: "200px", height: "250px", objectFit: "cover" }}
              className="rounded border mb-3"
            />
          ) : (
            <div className="mb-3 text-muted">(No image)</div>
          )}

          <h4 className="fw-bold mb-2">{brand.name ?? "(No name)"}</h4>

          <p className="text-muted">{brand.description || "(No description)"}</p>

          {brand.category && (
            <p className="text-muted">
              Category: <strong>{brand.category.name}</strong>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowBrand;
