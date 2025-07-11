// 📁 src/pages/Supplier/CreateSupplier.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";

// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

const CreateSupplier = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    company_name: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setMsg("Supplier saved!");
        setTimeout(() => navigate("/supplier/listsupplier"), 1200);
      } else {
        setMsg(result.message || "Failed to save supplier");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <>
      {/* ───── Breadcrumb & Title ───── */}
      <div className="card mb-3">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Add Supplier</h2>

          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <MUILink component={Link} to="/" underline="hover" color="inherit">
              <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </MUILink>
            <MUILink
              component={Link}
              to="/supplier/listsupplier"
              underline="hover"
              color="inherit"
            >
              Suppliers
            </MUILink>
            <Typography color="text.primary">Add&nbsp;Supplier</Typography>
          </Breadcrumbs>
        </div>
      </div>

      {/* ───── Main Card ───── */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* 1 row / 2 col : Name | Phone */}
            <div className="row2 d-flex gap-2 mb-3">
              <div className="form-group col-md-6">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group col-md-6">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 1 row / 2 col : Email | Company Name */}
            <div className="row2 d-flex gap-2 mb-3">
              <div className="form-group col-md-6">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group col-md-6">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  className="form-control"
                  value={form.company_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address (full width) */}
            <div className="form-group mb-4">
              <label>Address</label>
              <textarea
                name="address"
                className="form-control"
                rows="2"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn2 btn-icon">
                <DownloadDoneOutlinedIcon /> Submit
              </button>
              <Link to="/supplier/listsupplier" className="btn3 btn-icon">
                <ClearOutlinedIcon /> Cancel
              </Link>
            </div>

            {msg && (
              <div className="alert alert-info mt-3 mb-0" role="alert">
                {msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSupplier;
