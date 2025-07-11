import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";




const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null, // For new image upload
  });

  const [preview, setPreview] = useState(null); // For image preview (existing or new)
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          // `http://localhost/ecommerce_app/laravel_backend/public/api/categories/${id}`
          `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories/${id}`
        );
        const data = await res.json();

        setFormData({
          name: data.name ?? "",
          description: data.description ?? "",
          image: null, // no file selected initially
        });

        if (data.image) {
          setPreview(
            // `http://localhost/ecommerce_app/laravel_backend/public/img/Category/${data.image}`
            `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Category/${data.image}`
          );
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to load category data.");
      }
    };
    fetchCategory();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    if (formData.image) {
      fd.append("image", formData.image);
    }

    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/categories/${id}`,
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories/${id}`,
        {
          method: "POST", 
          headers: {
            "X-HTTP-Method-Override": "PUT",
          },
          body: fd,
        }
      );

      const result = await res.json();

      if (res.ok) {
        setMessage("Category updated successfully!");
        setTimeout(() => navigate("/inventory/category/listcategory"), 1500);
      } else {
        setMessage(result.message || "Failed to update category.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Edit Category</h2>
      </div>
      <hr />

      <div className="card"  style={{ width: "97%", margin: "auto" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="card-body">
              <div className="form-group mb-3">
                <label htmlFor="name">Category Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter category name"
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
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  name="image"
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
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                    className="rounded border"
                  />
                </div>
              )}
            </div>

            <div className="card-footer d-flex justify-content-between pt-3">
              <button className="btn2" type="submit">
                <SaveOutlinedIcon /> &nbsp; Update
              </button>
              <Link to="/inventory/category/listcategory" className="btn3">
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

export default EditCategory;
