import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Pagination from "../../../components/Pagination";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import Slider from "react-slick";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
    fetchLookups();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/products"
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/products"
      );
      const data = await res.json();
      console.log("Products:", data.products || data);
      const sorted = (data.products || data).sort((a, b) => b.id - a.id);
      setProducts(sorted);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch brands, categories, suppliers
  const fetchLookups = async () => {
    try {
      const [bRes, cRes, sRes] = await Promise.all([
        fetch(
          // "http://localhost/ecommerce_app/laravel_backend/public/api/brands"
          "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/brands"
        ),
        fetch(
          // "http://localhost/ecommerce_app/laravel_backend/public/api/categories"
          "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories"
        ),
        fetch(
          // "http://localhost/ecommerce_app/laravel_backend/public/api/suppliers"
          "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/suppliers"
        ),
      ]);
      setBrands((await bRes.json()).brands || []);
      setCategories((await cRes.json()).categories || []);
      setSuppliers((await sRes.json()).suppliers || []);
    } catch (err) {
      console.error("Error fetching lookup tables:", err);
    }
  };

  // Helpers to get names from IDs
  const getBrandName = (id) =>
    brands.find((b) => Number(b.id) === Number(id))?.name || "-";

  const getCategoryName = (id) =>
    categories.find((c) => Number(c.id) === Number(id))?.name || "-";

  const getSupplierName = (id) =>
    suppliers.find((s) => Number(s.id) === Number(id))?.name || "-";

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/products/${id}`,
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/products/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        const updated = products.filter((p) => p.id !== id);
        setProducts(updated);
        const pages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > pages) setCurrentPage(pages || 1);
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (p) => p >= 1 && p <= totalPages && setCurrentPage(p);

  return (
    <>
      <div>
        <Breadcrumbs separator="›" aria-label="breadcrumb" className="mb-5">
          <MUILink
            component={Link}
            to="/"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="20px" />
            Dashboard
          </MUILink>

          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Products
          </Typography>
        </Breadcrumbs>
      </div>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>
          List Of Products
        </h2>
        <Link
          to="/inventory/product/createproduct"
          className="btn2 btn-primary"
        >
          <UploadOutlinedIcon /> &nbsp; Add Product
        </Link>
      </div>

      <hr />

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-table">
              <thead className="table-light d-md-table-header-group">
                <tr>
                  <th>ID</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((prod) => {
                    // Handle possible JSON string for images (adjust if needed)
                    let imgUrl = null;
                    if (prod.img) {
                      try {
                        // If prod.img is JSON string array like '["img1.jpg", "img2.jpg"]'
                        const imgs = JSON.parse(prod.img);
                        if (Array.isArray(imgs) && imgs.length > 0) {
                          imgUrl = imgs[0];
                        } else {
                          imgUrl = prod.img;
                        }
                      } catch {
                        imgUrl = prod.img;
                      }
                    }

                    return (
                      <tr
                        key={prod.id}
                        className="d-block d-md-table-row mb-3 mb-md-0"
                      >
                        <td data-label="ID">{prod.id}</td>

                        {/* Photo */}
                        <td data-label="Photo">
                          {imgUrl ? (
                            <img
                              // src={`http://localhost/ecommerce_app/laravel_backend/public/img/Product/${imgUrl}`}
                              src={`http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Product/${imgUrl}`}
                              alt={prod.name}
                              className="img-fluid rounded"
                              style={{ maxWidth: "60px", maxHeight: "60px" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/60?text=No+Image";
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </td>

                        <td data-label="Name">{prod.name}</td>

                        <td data-label="Brand">
                          {prod.brand?.name || getBrandName(prod.brand_id)}
                        </td>
                        <td data-label="Category">
                          {prod.category?.name ||
                            getCategoryName(prod.category_id)}
                        </td>

                        <td data-label="Supplier">
                          {prod.supplier?.name ||
                            getSupplierName(prod.supplier_id)}
                        </td>

                        <td data-label="Price">
                          {Number(prod.price).toFixed(2)}
                        </td>
                        <td data-label="Qty">{prod.quantity}</td>
                        <td data-label="Status">
                          <span
                            className={
                              prod.status === "active"
                                ? "badge bg-success"
                                : "badge bg-secondary"
                            }
                          >
                            {prod.status}
                          </span>
                        </td>

                        <td
                          data-label="Action"
                          className="d-flex justify-content-center justify-content-md-start align-items-center gap-2"
                        >
                          <Link
                            to={`/inventory/product/editproduct/${prod.id}`}
                            className="icon-edit"
                          >
                            <BorderColorOutlinedIcon />
                          </Link>
                          <Link
                            to="#"
                            className="icon-delete"
                            onClick={() => handleDelete(prod.id)}
                          >
                            <AutoDeleteOutlinedIcon />
                          </Link>
                          <Link
                            to={`/inventory/product/showproduct/${prod.id}`}
                            className="icon-view"
                          >
                            <VisibilityOutlinedIcon />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ListProduct;
