import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

// const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public";
const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public";

const EditBrand = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    photo: null,          
    currentImage: "",    
  });
  const [categories, setCategories] = useState([]); 
  const [preview, setPreview] = useState(null);    
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        else if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
        else setCategories([]);
      })
      .catch(err => console.error("Failed to load categories:", err));

    fetch(`${BASE_URL}/api/brands/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          category_id: data.category_id || "",
          photo: null,
          currentImage: data.image || "",
        });
        if (data.image) {
          setPreview(`${BASE_URL}/img/Brand/${data.image}`);
        }
      })
      .catch(err => {
        console.error("Failed to load brand data:", err);
        setMessage("Failed to load brand data.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData(prev => ({ ...prev, photo: file }));
      setPreview(file ? URL.createObjectURL(file) : preview);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("category_id", formData.category_id);
    fd.append("currentImage", formData.currentImage);
    if (formData.photo) fd.append("image", formData.photo);

    try {
      const res = await fetch(`${BASE_URL}/api/brands/${id}`, {
        method: "POST", 
        headers: { "X-HTTP-Method-Override": "PUT" },
        body: fd,
      });
      const result = await res.json();

      if (res.ok) {
        setMessage("Brand updated successfully!");
        setTimeout(() => navigate("/inventory/brand/listbrand"), 1500);
      } else {
        setMessage(result.message || "Failed to update brand.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Edit Brand</h2>
      </div>
      <hr />

      <div className="card"  >
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group mb-3">
              <label htmlFor="name">Brand Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter brand name"
                value={formData.name}
                onChange={handleChange}
              
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
              <label htmlFor="category_id">Category</label>
              <select
                name="category_id"
                className="form-select"
                value={formData.category_id}
                onChange={handleChange}
           
              >
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="photo">Replace Photo (optional)</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {preview && (
              <div className="mb-3">
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  className="rounded border"
                />
              </div>
            )}

            <div className="card-footer d-flex justify-content-between pt-3">
              <button type="submit" className="btn2">
                <SaveOutlinedIcon /> Update

              </button>
              <Link to="/inventory/brand/listbrand" className="btn3">
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

export default EditBrand;
