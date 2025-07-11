import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const CreateWarehouse = () => {
 
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  /* ──────────────────────────────
     Handle field changes
     ────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ──────────────────────────────
     Submit
     ────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/warehouses",
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/warehouses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();

      if (result.success) {
        setMessage("Warehouse saved successfully!");
        setFormData({ name: "", location: "" });
        setTimeout(() => navigate("/warehouse/listwatehouse"), 1500);
      } else {
        setMessage(result.message || "Failed to save warehouse.");
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
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Add Warehouse</h2>
      </div>
      <hr />

      <div className="card" style={{ width: "97%", margin: "auto" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              {/* Name */}
              <div className="form-group mb-3">
                <label htmlFor="name">Warehouse Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter warehouse name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="form-group mb-3">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Enter location"
                  value={formData.location}
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
              <Link to="/warehouse/listwatehouse" className="btn3">
                <ClearOutlinedIcon /> Cancel
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

export default CreateWarehouse;
