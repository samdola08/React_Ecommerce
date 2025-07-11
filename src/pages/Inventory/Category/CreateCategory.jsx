import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  /* Handle input changes */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* Submit form */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    if (formData.image) fd.append("image", formData.image);

    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/categories",
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories",
        {
          method: "POST",
          body: fd,
        }
      );
      const result = await res.json();

      if (result.success) {
        setMessage("Category saved successfully!");
        setFormData({ name: "", description: "", image: null });
        setPreview(null);
        setTimeout(() => navigate("/inventory/category/listcategory"), 1500);
      } else {
        setMessage(result.message || "Failed to save category.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Add Category</h2>
      </div>
      <hr />

      <div className="card"  style={{ width: "97%", margin: "auto" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group mb-3">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            {preview && (
              <div className="mb-3">
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                  className="rounded border"
                />
              </div>
            )}

            <div className="card-footer d-flex justify-content-between">
              <button className="btn2" type="submit">
                <DownloadDoneOutlinedIcon /> &nbsp; Submit
              </button>
              <Link to="/inventory/category/listcategory" className="btn3">
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

export default CreateCategory;
