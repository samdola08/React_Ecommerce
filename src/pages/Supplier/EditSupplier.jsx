import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const EditSupplier = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    company_name: "",
  });
  const [message, setMessage] = useState("");

  /* ──────────────────────────────
     Fetch supplier once on mount
     ────────────────────────────── */
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res   = await fetch(
          // `http://localhost/ecommerce_app/laravel_backend/public/api/suppliers/${id}`
          `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/suppliers/${id}`
        );
        const data  = await res.json();
        setFormData({
          name:    data.name    ?? "",
          phone:   data.phone   ?? "",
          email:   data.email   ?? "",
          address: data.address ?? "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load supplier data.");
      }
    };
    fetchSupplier();
  }, [id]);

  /* ──────────────────────────────
     Field changes
     ────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ──────────────────────────────
     Submit updates
     ────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/suppliers/${id}`,
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/suppliers/${id}`,
        {
          method: "POST",                     // use POST + override for PUT
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "PUT",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();

      if (res.ok) {
        setMessage("Supplier updated successfully!");
        setTimeout(() => navigate("/supplier/listsupplier"), 1500);
      } else {
        setMessage(result.message || "Failed to update supplier.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  /* ──────────────────────────────
     JSX
     ────────────────────────────── */
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Edit Supplier</h2>
      </div>
      <hr />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              {/* Name & Phone */}
              <div className="row">
                <div className="form-group col-md-6 mb-3">
                  <label htmlFor="name">Supplier Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter supplier name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group col-md-6 mb-3">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
               <div className="form-group col-md-6 mb-3">
                  <label htmlFor="name">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    className="form-control"
                    placeholder="Enter Company name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
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
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer d-flex justify-content-between pt-3">
              <button className="btn2" type="submit">
                <SaveOutlinedIcon /> &nbsp; Update
              </button>
              <Link to="/supplier/listsupplier" className="btn3">
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

export default EditSupplier;
