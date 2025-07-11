import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ShowCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public";
  const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public";

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories/${id}`);
        if (!res.ok) throw new Error("Category not found");
        const data = await res.json();

        setCategory(data.category); 
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <p>Loading category...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!category) return null;

  const imageUrl = category.image
    ? `${BASE_URL}/img/Category/${category.image}`
    : null;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Category Details</h2>
        <div className="d-flex gap-2">
          <Link to={`/inventory/category/editcategory/${id}`} className="btn2" title="Edit Category">
            <BorderColorOutlinedIcon /> &nbsp; Edit
          </Link>
          <Link to="/inventory/category/listcategory" className="btn3 btn btn-outline-secondary">
            <ArrowBackIosNewIcon fontSize="small" /> &nbsp; Back
          </Link>
        </div>
      </div>
      <hr />

      <div className="card shadow-sm">
        <div className="card-body text-center">
          {/* ✅ Show image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={category.name}
              style={{ width: "200px", height: "250px", objectFit: "cover" }}
              className="rounded border mb-3"
            />
          ) : (
            <div className="mb-3 text-muted">(No image)</div>
          )}

          <h4 className="fw-bold mb-2">{category.name ?? "(No name)"}</h4>

          <p className="text-muted">{category.description || "(No description)"}</p>
        </div>
      </div>
    </>
  );
};

export default ShowCategory;
