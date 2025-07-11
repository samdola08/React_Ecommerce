import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const CreateBrand = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: null,
    category_id: "",  
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]); 
  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/categories"
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories"
      );
      const data = await res.json();
      setCategories(data.categories || data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("category_id", formData.category_id);  // <-- Append category_id
    if (formData.photo) fd.append("image", formData.photo);

    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/brands",
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/brands",

        {
          method: "POST",
          body: fd,
        }
      );
      const result = await res.json();

      if (result.success) {
        setMessage("Brand saved successfully!");
        setFormData({ name: "", description: "", photo: null, category_id: "" });
        setPreview(null);

        setTimeout(() => {
          navigate("/inventory/brand/listbrand");
        }, 1500);
      } else {
        setMessage(result.message || "Failed to save brand.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Add Brand</h2>
      </div>
      <hr />
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="card-body">
              {/* Name */}
              <div className="form-group mb-3">
                <label htmlFor="name">Brand Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter brand name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
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

              {/* Category Dropdown */}
              <div className="form-group mb-3">
                <label htmlFor="category_id">Category</label>
                <select
                  name="category_id"
                  className="form-control"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo */}
              <div className="form-group mb-3">
                <label htmlFor="photo">Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="preview"
                    style={{ width: "150px", objectFit: "cover" }}
                    className="rounded border"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="card-footer d-flex justify-content-between">
              <button className="btn2" type="submit">
                <DownloadDoneOutlinedIcon /> &nbsp; Submit
              </button>
              <Link to="/inventory/brand/listbrand" className="btn3">
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

export default CreateBrand;
