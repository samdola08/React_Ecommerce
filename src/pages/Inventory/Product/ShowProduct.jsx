import React, { useState, useRef, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Slider from "react-slick";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ShowProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");
        // const res = await fetch(`http://localhost/ecommerce_app/laravel_backend/public/api/products/${id}`);
        const res = await fetch(`http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const bigSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const smallSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: false,
    centerMode: true,
    centerPadding: "10px",
    autoplaySpeed: 1000,
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!product) return <p>No product data available</p>;

  // const imgBase = "http://localhost/ecommerce_app/laravel_backend/public/img/Product/";
  const imgBase = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Product/";
  let images = [];

  try {
    if (product.img) {
      const parsed = JSON.parse(product.img);
      if (Array.isArray(parsed)) {
        images = parsed.map(img => imgBase + img);
      } else {
        images = [imgBase + product.img];
      }
    }
  } catch {
    images = [imgBase + product.img];
  }

  if (images.length === 0) {
    images = ["https://via.placeholder.com/300?text=No+Image"];
  }

  return (
    <>
      <div>
        <Breadcrumbs separator="›" aria-label="breadcrumb" className="mb-5">
          <MUILink component={RouterLink} to="/" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }}>
            <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </MUILink>
          <MUILink component={RouterLink} to="/inventory/product/listproduct" underline="hover" color="inherit">
            Products
          </MUILink>
          <Typography color="text.primary">Product Details</Typography>
        </Breadcrumbs>

        <div className="card" style={{ marginTop: "-30px" }}>
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <h2 className="fw-bold" style={{ color: "#034158" }}>Product Details</h2>
              <div className="d-flex gap-2">
                <RouterLink to={`/inventory/product/editproduct/${id}`} className="btn2">
                  <BorderColorOutlinedIcon /> Edit
                </RouterLink>
                <RouterLink to="/inventory/product/listproduct" className="btn3 btn btn-outline-secondary">
                  <ArrowBackIosNewIcon fontSize="small" /> Back
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="card">
          <div className="card-body">
            <div className="row g-5">
              <div className="col-md-5 mb-4">
                <h4 className="mb-5">Product Gallery</h4>
                <Slider {...bigSettings} asNavFor={nav2} ref={slider1}>
                  {images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={img}
                        alt={`product-big-${i}`}
                        className="img-fluid rounded"
                        style={{ width: "80%", border: "4px dashed #ccc", borderRadius: "8px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </Slider>

                <Slider {...smallSettings} asNavFor={nav1} ref={slider2} style={{ marginTop: 20 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ display: "flex" }}>
                      <img
                        src={img}
                        alt={`product-small-${i}`}
                        style={{
                          width: "80px",
                          cursor: "pointer",
                          border: "3px dashed #ccc",
                          borderRadius: "4px",
                          boxSizing: "border-box",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/80?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              <div className="col-md-7">
                <h4 className="mb-5">Product Details</h4>
                <div className="d-flex gap-5">
                  <h3 style={{ color: "#777e89" }}>Name</h3>
                  <h6 style={{ color: "#777e89", paddingTop: "5px" }}>{product.name || "-"}</h6>
                </div>
                <br /><br />
                <table className="table">
                  <tbody>
                    <tr>
                      <th><AppRegistrationOutlinedIcon /> &nbsp;&nbsp;Category</th>
                      <td>{product.category || "-"}</td>

                    </tr>
                    <tr>
                      <th><i className="fa-solid fa-truck-field"></i>&nbsp;&nbsp;Supplier</th>
                      <td>{product.supplier || "-"}</td>
                    </tr>
                    <tr>
                      <th><QrCode2OutlinedIcon /> &nbsp;&nbsp;Barcode</th>
                      <td>{product.barcode || "-"}</td>
                    </tr>
                    <tr>
                      <th><LoyaltyOutlinedIcon /> &nbsp;&nbsp;Price</th>
                      <td>{product.price ? `৳ ${product.price}` : "-"}</td>
                    </tr>
                    <tr>
                      <th><DiscountOutlinedIcon /> &nbsp;&nbsp;Discount</th>
                      <td>{product.discount ? `৳ ${product.discount}` : "-"}</td>
                    </tr>
                    <tr>
                      <th><LocalOfferOutlinedIcon /> &nbsp;&nbsp;Tax</th>
                      <td>{product.tax ? `৳ ${product.tax}` : "-"}</td>
                    </tr>
                    <tr>
                      <th><ProductionQuantityLimitsOutlinedIcon /> &nbsp;&nbsp;Quantity</th>
                      <td>{product.quantity ?? "-"}</td>
                    </tr>
                    <tr>
                      <th><i className="fa-regular fa-copyright"></i> &nbsp;&nbsp;Brand</th>
                      <td>{product.brand || "-"}</td>
                    </tr>
                    <tr>
                      <th><i className="fa-regular fa-comment"></i> &nbsp;&nbsp;Status</th>
                      <td>
                        {product.status === "active" ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Inactive</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br /><br />
            <div>
              <h3 style={{ color: "#777e89" }}>Product Description</h3>
              <p style={{ color: "#777e89" }}>{product.description || "No description available."}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowProduct;
