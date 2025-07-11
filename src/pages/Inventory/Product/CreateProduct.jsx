import React, { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import ImageUploadCard from "../../../components/imageCard/ImageUploadCard";
import "./create.css";
import useImages from "../../../hooks/useImage";
const CreateProduct = () => {
  const [images, setImages] = useState([]); // stores File objects
  const [previews, setPreviews] = useState([]); // stores preview URLs

  // Add new images and previews
  const add = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove image and preview by index
  const remove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      // Clean up the URL object to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Clean up all object URLs on component unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  /* form values that are simple strings/numbers */
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    supplier_id: "",
    barcode: "",
    price: "",
    discount: "",
    tax: "",
    quantity: "0",
    status: "active",
    description: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  /* ──────────────────────────────────────────
     2.  Fetch dropdown options
  ────────────────────────────────────────── */
  useEffect(() => {
    fetchOptions("brands", setBrands);
    fetchOptions("categories", setCategories);
    fetchOptions("suppliers", setSuppliers);
  }, []);

  const fetchOptions = async (endpoint, setter) => {
    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/${endpoint}`
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/${endpoint}`
      );
      const data = await res.json();
      setter(data[endpoint] || data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ──────────────────────────────────────────
     3.  Handle changes
  ────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    /* handle images */
    if (name === "img") {
      const list = Array.from(files); // FileList → File[]
      setImages(list);

      /* create object URLs for previews */
      const urls = list.map((f) => URL.createObjectURL(f));
      setPreviews(urls);
      return;
    }

    /* handle other inputs */
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* Clean blob URLs on unmount */
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  /* ──────────────────────────────────────────
     4.  Submit
  ────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    /* append scalar fields */
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

    /* append every image */
    images.forEach((file) => fd.append("imgs[]", file));

    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/products",
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/products",
        { method: "POST", body: fd }
      );
      const result = await res.json();

      if (result.success) {
        setMessage("Product saved successfully!");
        resetForm();
        setTimeout(() => navigate("/inventory/product/listproduct"), 1500);
      } else {
        setMessage(result.message || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand_id: "",
      category_id: "",
      supplier_id: "",
      barcode: "",
      price: "",
      discount: "0.00",
      tax: "0.00",
      quantity: "0",
      status: "active",
      description: "",
    });
    setImages([]);
    setPreviews([]);
  };

  /* ──────────────────────────────────────────
     5.  JSX
  ────────────────────────────────────────── */
  return (
    <>
      {/* ─────── Breadcrumb + page title ─────── */}
      <div className="card" style={{ width: "100%" }}>
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start ">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>
            Upload Product
          </h2>

          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <MUILink component={Link} underline="hover" color="inherit" to="/">
              <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </MUILink>

            <MUILink
              component={Link}
              underline="hover"
              color="inherit"
              to="/inventory/product/listproduct"
            >
              Products
            </MUILink>

            <Typography color="text.primary">Add&nbsp;Product</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <hr />

      {/* ─────── Main form card ─────── */}
      <div className="card">
        <div className="card-body">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            style={{ marginTop: "-50px" }}
          >
            <div className="card-body">
              {/* SECTION: Details */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="mb-3" style={{ color: "#034158" }}>
                    Product Details
                  </h4>

                  <div className="row2 d-flex  gap-3">
                    {/* Name */}
                    <div className="form-group col-md-6 mb-3">
                      <label htmlFor="name">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Barcode */}
                    <div className="form-group col-md-6 mb-3">
                      <label htmlFor="barcode">Barcode</label>
                      <input
                        type="text"
                        name="barcode"
                        className="form-control"
                        placeholder="Enter barcode"
                        value={formData.barcode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="row2  d-flex  gap-2">
                    {/* Brand */}
                    <div className="form-group col-md-4 mb-3">
                      <label htmlFor="brand_id">Brand</label>
                      <select
                        name="brand_id"
                        className="form-control"
                        value={formData.brand_id}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Brand --</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div className="form-group col-md-4 mb-3">
                      <label htmlFor="catetory_id">Category</label>
                      <select
                        name="category_id"
                        className="form-control"
                        value={formData.category_id}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Supplier */}
                    <div className="form-group col-md-4 mb-3">
                      <label htmlFor="supplier_id">Supplier</label>
                      <select
                        name="supplier_id"
                        className="form-control"
                        value={formData.supplier_id}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Supplier --</option>
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="row2  d-flex  gap-2">
                    {/* Price */}
                    <div className="form-group col-md-3 mb-3">
                      <label htmlFor="price">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        className="form-control"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Discount */}
                    <div className="form-group col-md-3 mb-3">
                      <label htmlFor="discount">Discount</label>
                      <input
                        type="number"
                        step="0.01"
                        name="discount"
                        className="form-control"
                        value={formData.discount}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Tax */}
                    <div className="form-group col-md-3 mb-3">
                      <label htmlFor="tax">Tax</label>
                      <input
                        type="number"
                        step="0.01"
                        name="tax"
                        className="form-control"
                        value={formData.tax}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="form-group col-md-3 mb-3">
                      <label htmlFor="quantity">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="form-group mb-3">
                    <label htmlFor="status">Status</label>
                    <select
                      name="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="form-group mb-3">
                    <label htmlFor="description">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* SECTION: Images */}
              <div className="card">
                <div className="card-body">
                  <div className="form-group mb-3">
                    {/* <label htmlFor="img">Media & Published</label> */}
                    <ImageUploadCard
                      images={previews}
                      onChange={add} // Pass the event handler directly here
                      onRemove={remove}
                      onPublish={handleSubmit}
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
            </div>

            {/* Footer */}
            <div className="card">
              <div className="card-footer d-flex justify-content-between">
                <button type="submit" className="btn2 btn-icon">
                  <DownloadDoneOutlinedIcon /> Submit
                </button>
                <Link
                  to="/inventory/product/listproduct"
                  className="btn3 btn-icon"
                >
                  <ClearOutlinedIcon /> Cancel
                </Link>
              </div>
            </div>

            {message && (
              <div className="alert alert-info m-3" role="alert">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
