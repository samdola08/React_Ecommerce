import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const CreateCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    status: "active",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  /* -------------------- handlers -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/customers",
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/customers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      if (res.ok) {
        setMessage("Customer saved successfully!");
        setFormData({ name: "", email: "", address: "", status: "active" });
        setTimeout(() => navigate("/customer/listcustomer"), 1500);
      } else {
        setMessage(result.message || "Failed to save customer.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  /* -------------------- ui -------------------- */
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold" style={{ color: "#034158" }}>
          Add Customer
        </h2>
      </div>
      <hr />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              {/* ── Name • Email • Status in one row ── */}
              <div className="row">
                {/* Name */}
                <div className="form-group mb-3 col-md-4">
                  <label htmlFor="name">Customer Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter customer name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group mb-3 col-md-4">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mb-3 col-md-4">
                  <label htmlFor="phone">Phone no.</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Enter Phone "
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {/* Status */}
                <div className="form-group mb-3 col-md-4">
                  <label htmlFor="status">Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="form-group mb-3">
                <label htmlFor="address">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer d-flex justify-content-between">
              <button className="btn2" type="submit">
                <DownloadDoneOutlinedIcon /> &nbsp; Submit
              </button>
              <Link to="/customer/listcustomer" className="btn3">
                <ClearOutlinedIcon /> Cancel
              </Link>
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

export default CreateCustomer;
