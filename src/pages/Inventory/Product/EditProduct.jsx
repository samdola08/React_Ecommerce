import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import ImageUploadCard from "../../../components/imageCard/ImageUploadCard";
import "./create.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // New uploaded images (File objects)
  const [images, setImages] = useState([]);
  // Previews for both existing images (URLs) and new uploads (object URLs)
  const [previews, setPreviews] = useState([]);
  // Existing images from backend (URLs)
  const [existingImages, setExistingImages] = useState([]);
  // Existing images marked for removal (URLs)
  const [removedExistingImages, setRemovedExistingImages] = useState([]);

  // Dropdown options
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    categorie_id: "",
    supplier_id: "",
    barcode: "",
    price: "",
    discount: "0.00",
    tax: "0.00",
    quantity: "0",
    status: "active",
    description: "",
  });

  const [message, setMessage] = useState("");

  // Fetch dropdown options
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

  // Fetch product data by ID and populate form + images
  useEffect(() => {
    if (!id) return;

   const fetchProduct = async () => {
  try {
    const res = await fetch(
      // `http://localhost/ecommerce_app/laravel_backend/public/api/products/${id}`
      `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/products/${id}`
    );
    const data = await res.json();

    console.log("Fetch product response:", res.status, data);

    if (res.ok && data.product) {
      const p = data.product;
      // ...
    } else if (res.ok) {
      // fallback if API returns product directly
      const p = data;
      setFormData({
        name: p.name || "",
        brand_id: p.brand_id?.toString() || "",
        categorie_id: p.categorie_id?.toString() || "",
        supplier_id: p.supplier_id?.toString() || "",
        barcode: p.barcode || "",
        price: p.price || "",
        discount: p.discount || "0.00",
        tax: p.tax || "0.00",
        quantity: p.quantity?.toString() || "0",
        status: p.status || "active",
        description: p.description || "",
      });

      const imgs = p.images || [];
      setExistingImages(imgs);
      setPreviews(imgs);
    } else {
      setMessage(data.message || "Failed to fetch product data.");
    }
  } catch (error) {
    console.error(error);
    setMessage("Server error while fetching product.");
  }
};


    fetchProduct();
  }, [id]);

  // Add new images and previews
  const add = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove image (existing or new) by index
  const remove = (index) => {
    if (index < existingImages.length) {
      // Remove existing image
      const removedImg = existingImages[index];
      setRemovedExistingImages((prev) => [...prev, removedImg]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove new uploaded image
      const newImgIndex = index - existingImages.length;
      setImages((prev) => prev.filter((_, i) => i !== newImgIndex));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle form input changes (except images)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Submit updated product data
const handleSubmit = async (e) => {
  e.preventDefault();

  const fd = new FormData();

  // Append scalar form data
  Object.entries(formData).forEach(([key, val]) => fd.append(key, val));

  // Append new image files
  images.forEach((file) => fd.append("imgs[]", file));

  // Append removed existing images
  fd.append("removed_images", JSON.stringify(removedExistingImages));

  // Add method spoofing to simulate PUT
  fd.append("_method", "PUT");

  try {
    const res = await fetch(
      // `http://localhost/ecommerce_app/laravel_backend/public/api/products/${id}`,
      `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/products/${id}`,
      {
        method: "POST", // use POST here!
        body: fd,
      }
    );

    const result = await res.json();

    if (result.success) {
      setMessage("Product updated successfully!");
      setTimeout(() => navigate("/inventory/product/listproduct"), 1500);
    } else {
      setMessage(result.message || "Failed to update product.");
    }
  } catch (error) {
    console.error(error);
    setMessage("Server error.");
  }
};

  return (
    <>
      {/* Breadcrumb and Title */}
      <div className="card" style={{ width: "100%" }}>
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start ">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Edit Product</h2>

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

            <Typography color="text.primary">Edit Product</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <hr />

      {/* Form */}
      <div className="card">
        <div className="card-body">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            style={{ marginTop: "-50px" }}
          >
            <div className="card-body">
              {/* Product Details Section */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="mb-3" style={{ color: "#034158" }}>
                    Product Details
                  </h4>

                  <div className="row2 d-flex gap-3">
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

                  <div className="row2 d-flex gap-2">
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
                      <label htmlFor="categorie_id">Category</label>
                      <select
                        name="categorie_id"
                        className="form-control"
                        value={formData.categorie_id}
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

                  <div className="row2 d-flex gap-2">
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
                    />
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="card">
                <div className="card-body">
                  <div className="form-group mb-3">
                    <ImageUploadCard
                      images={previews}
                      onChange={add}
                      onRemove={remove}
                      onPublish={handleSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="card">
              <div className="card-footer d-flex justify-content-between">
                <button type="submit" className="btn2 btn-icon">
                  <DownloadDoneOutlinedIcon /> Update
                </button>
                <Link to="/inventory/product/listproduct" className="btn3 btn-icon">
                  <ClearOutlinedIcon /> Cancel
                </Link>
              </div>
            </div>

            {/* Message */}
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

export default EditProduct;
