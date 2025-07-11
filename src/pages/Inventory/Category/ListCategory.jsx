import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Pagination from "../../../components/Pagination";




const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res  = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/categories"
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories"
      );
      const data = await res.json();
      setCategories(data.categories || data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/categories/${id}`,
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/categories/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        const newTotal = Math.ceil((categories.length - 1) / itemsPerPage);
        if (currentPage > newTotal) setCurrentPage(newTotal || 1);
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Error deleting category");
    }
  };

  const totalPages  = Math.ceil(categories.length / itemsPerPage);
  const startIndex  = (currentPage - 1) * itemsPerPage;
  const currentCats = categories.slice(startIndex, startIndex + itemsPerPage);
  const goToPage    = (p) => p >= 1 && p <= totalPages && setCurrentPage(p);

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"  style={{ width: "95%", margin: "auto" }}>
        <h2 className="fw-bold" style={{ color: "#034158" }}>List Of Categories</h2>
        <Link  to="/inventory/category/createcategory" className="btn2 btn-primary">
          <UploadOutlinedIcon /> Add Category
        </Link>
      </div>
      <hr />

      <div className="card shadow-sm"  style={{ width: "97%", margin: "auto" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-table">
              <thead className="table-light d-md-table-header-group">
                <tr>
                  <th>ID</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCats.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  currentCats.map((cat) => (
                    <tr key={cat.id} className="d-block d-md-table-row mb-3 mb-md-0">
                      <td data-label="ID">{cat.id}</td>
                      <td data-label="Photo">
                        {cat.image ? (
                          <img
                            // src={`http://localhost/ecommerce_app/laravel_backend/public/img/Category/${cat.image}`}
                            src={`http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Category/${cat.image}`}
                            alt={cat.name}
                            className="img-fluid rounded"
                            style={{ maxWidth: "80px", maxHeight: "60px" }}
                          />
                        ) : "-"}
                      </td>
                      <td data-label="Name">{cat.name}</td>
                      <td data-label="Description">{cat.description || "-"}</td>
                      <td
                        data-label="Action"
                        className="d-flex justify-content-center justify-content-md-start align-items-center gap-2"
                      >
                        <Link  to={`/inventory/category/editcategory/${cat.id}`} className="icon-edit">
                          <BorderColorOutlinedIcon />
                        </Link>
                        <Link  to="#" className="icon-delete" onClick={() => handleDelete(cat.id)}>
                          <AutoDeleteOutlinedIcon />
                        </Link>
                        <Link  to={`/inventory/category/showcategory/${cat.id}`} className="icon-view">
                          <VisibilityOutlinedIcon />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      </div>
    </>
  );
};

export default ListCategory;
