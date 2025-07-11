import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ShowProduct = () => {
  const { id } = useParams();

  const [product,    setProduct]    = useState(null);
  const [brands,     setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers,  setSuppliers]  = useState([]);

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  /* ---------- helpers ---------- */
  const safeNumber = (v) => Number(v || 0).toFixed(2);

  const getBrandName =   (bid) => brands.find(b => +b.id === +bid)?.name     || bid || "-";
  const getCategoryName = (cid) => categories.find(c => +c.id === +cid)?.name || cid || "-";
  const getSupplierName = (sid) => suppliers.find(s => +s.id === +sid)?.name  || sid || "-";

  /* ---------- fetch everything once ---------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1) product
        const pRes = await fetch(
          `http://localhost/ecommerce_app/laravel_backend/public/api/products/${id}`
          // `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/products/${id}`
        );
        if (!pRes.ok) throw new Error("Product not found");
        setProduct(await pRes.json());

        // 2) lookup tables in parallel
        const [bRes, cRes, sRes] = await Promise.all([
          fetch("http://localhost/ecommerce_app/laravel_backend/public/api/brands"),
          // fetch("http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/brands"),
          fetch("http://localhost/ecommerce_app/laravel_backend/public/api/categories"),
          // fetch("http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories"),
          fetch("http://localhost/ecommerce_app/laravel_backend/public/api/suppliers"),
          // fetch("http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/suppliers"),
        ]);
        setBrands    ((await bRes.json()).brands     || []);
        setCategories((await cRes.json()).categories || []);
        setSuppliers ((await sRes.json()).suppliers  || []);
      } catch (err) {
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return <p>Loading product…</p>;
  if (error)   return <p className="text-danger">{error}</p>;

  const netPrice = (
    parseFloat(product.price || 0) -
    parseFloat(product.discount || 0) +
    parseFloat(product.tax || 0)
  ).toFixed(2);

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold" style={{ color: "#034158" }}>Product Details</h2>
        <div className="d-flex gap-2">
          <Link to={`/inventory/product/editproduct/${id}`} className="btn2">
            <BorderColorOutlinedIcon /> Edit
          </Link>
          <Link to="/inventory/product/listproduct" className="btn3 btn btn-outline-secondary">
            <ArrowBackIosNewIcon fontSize="small" /> Back
          </Link>
        </div>
      </div>
      <hr />

      <div className="card shadow-sm">
        <div className="card-body">
          {/* Image + name */}
          <div className="text-center mb-4">
            {product.img ? (
              <img
                src={`http://localhost/ecommerce_app/laravel_backend/public/img/Product/${product.img}`}
                // src={`http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Product/${product.img}`}
                alt={product.name}
                className="img-thumbnail mb-2"
              />
            ) : (
              <span className="badge bg-secondary mb-2">No Image</span>
            )}
            <h4 className="fw-bold">{product.name}</h4>
            <span className={`badge ${product.status === "active" ? "bg-success" : "bg-secondary"}`}>
              {product.status}
            </span>
          </div>

          {/* Details grid */}
          <div className="row">
            <Field label="Brand"     value={product.brand?.name     || getBrandName(product.brand_id)} />
            <Field label="Category"  value={product.category?.name  || getCategoryName(product.categorie_id)} />
            <Field label="Supplier"  value={product.supplier?.name  || getSupplierName(product.supplier_id)} />
            <Field label="Barcode"   value={product.barcode || "-"} />
            <Field label="Price"     value={`৳ ${safeNumber(product.price)}`} isPrice />
            <Field label="Discount"  value={`৳ ${safeNumber(product.discount)}`} isPrice />
            <Field label="Tax"       value={`৳ ${safeNumber(product.tax)}`} isPrice />
            <Field label="Net Price" value={`৳ ${netPrice}`} highlight isPrice />
            <Field label="Quantity"  value={product.quantity || "-"} />
            <Field label="Description" value={product.description || "-"} isFull />
          </div>

          {/* Timestamps */}
          <div className="text-muted small mt-3">
            {product.created_at && <div>Created: {new Date(product.created_at).toLocaleString()}</div>}
            {product.updated_at && <div>Updated: {new Date(product.updated_at).toLocaleString()}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

/* Reusable field */
const Field = ({ label, value, highlight = false, isFull = false }) => (
  <div className={`col-md-${isFull ? 12 : 6} mb-3`}>
    <strong className={highlight ? "text-success" : ""}>{label}:</strong><br />
    <span className="text-muted">{value}</span>
  </div>
);

export default ShowProduct;
