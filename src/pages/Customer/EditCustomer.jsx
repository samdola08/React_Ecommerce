import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

// const BASE = "http://localhost/ecommerce_app/laravel_backend/public";
const BASE = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    status: "active",
  });
  const [message, setMessage] = useState("");

  /* ───────────── fetch once ───────────── */
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res  = await fetch(`${BASE}/api/customers/${id}`);
        const data = await res.json();
        setFormData({
          name:    data.name    ?? "",
          email:   data.email   ?? "",
          phone:   data.phone   ?? "",
          address: data.address ?? "",
          status:  data.status  ?? "active",
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load customer data.");
      }
    };
    fetchCustomer();
  }, [id]);

  /* ───────────── handlers ───────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE}/api/customers/${id}`, {
        method: "POST", // POST + override
        headers: {
          "Content-Type": "application/json",
          "X-HTTP-Method-Override": "PUT",
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (res.ok) {
        setMessage("Customer updated successfully!");
        setTimeout(
          () => navigate("/inventory/customer/listcustomer"),
          1500
        );
      } else {
        setMessage(result.message || "Failed to update customer.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  /* ───────────── UI ───────────── */
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Edit Customer</h2>
      </div>
      <hr />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              {/* Name · Email · Status */}
              <div className="row">
                <div className="form-group col-md-4 mb-3">
                  <label htmlFor="name">Customer Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group col-md-4 mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <label htmlFor="email">Phone no.</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group col-md-4 mb-3">
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
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer d-flex justify-content-between pt-3">
              <button className="btn2" type="submit">
                <SaveOutlinedIcon /> &nbsp; Update
              </button>
              <Link to="/inventory/customer/listcustomer" className="btn3">
                <ClearOutlinedIcon /> &nbsp; Cancel
              </Link>
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

export default EditCustomer;
