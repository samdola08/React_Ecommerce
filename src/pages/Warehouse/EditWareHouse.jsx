import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const EditWarehouse = () => {
  const { id }   = useParams();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });
  const [message, setMessage] = useState("");


  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const res  = await fetch(
          // `http://localhost/ecommerce_app/laravel_backend/public/api/warehouses/${id}`
          `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/warehouses/${id}`
        );
        const data = await res.json();
        setFormData({
          name:     data.name     ?? "",
          location: data.location ?? "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load warehouse data.");
      }
    };
    fetchWarehouse();
  }, [id]);

  /* ──────────────────────────────
     Handle field changes
     ────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ──────────────────────────────
     Submit (update)
     ────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/warehouses/${id}`,
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/warehouses/${id}`,
        {
          method: "POST", // use POST + method‑override for PUT
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "PUT",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();

      if (res.ok) {
        setMessage("Warehouse updated successfully!");
        setTimeout(() => navigate("/warehouse/listwatehouse"), 1500);
      } else {
        setMessage(result.message || "Failed to update warehouse.");
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
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Edit Warehouse</h2>
      </div>
      <hr />

      <div className="card">
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
            <div className="card-footer d-flex justify-content-between pt-3">
              <button className="btn2" type="submit">
                <SaveOutlinedIcon /> &nbsp; Update
              </button>
              <Link to="/warehouse/listwatehouse" className="btn3">
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

export default EditWarehouse;
