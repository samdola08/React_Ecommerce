import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Pagination from "../../../components/Pagination";

const ListBrand = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch brands and categories on component mount
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/brands"
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/brands"
      );
      const data = await res.json();
      setBrands(data.brands || data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/brands/${id}`,
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/brands/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        const updatedBrands = brands.filter((b) => b.id !== id);
        setBrands(updatedBrands);

        // Adjust page if current page is beyond last page after delete
        const lastPage = Math.ceil(updatedBrands.length / itemsPerPage);
        if (currentPage > lastPage) setCurrentPage(lastPage || 1);
      } else {
        console.error("Failed to delete brand");
      }
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBrands = brands.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold" style={{ color: "#034158" }}>
          List Of Brands
        </h2>
        <Link to="/inventory/brand/createbrand" className="btn2 btn-primary">
          <UploadOutlinedIcon /> Add Brand
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
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentBrands.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No brands found.
                    </td>
                  </tr>
                ) : (
                  currentBrands.map((brand) => (
                    <tr key={brand.id} className="d-block d-md-table-row mb-3 mb-md-0">
                      <td data-label="ID">{brand.id}</td>
                      <td data-label="Photo">
                        {brand.image ? (
                          <img
                            // src={`http://localhost/ecommerce_app/laravel_backend/public/img/Brand/${brand.image}`}
                            src={`http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Brand/${brand.image}`}
                            alt={brand.name}
                            className="img-fluid rounded"
                            style={{ maxWidth: "80px", maxHeight: "60px" }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td data-label="Name">{brand.name}</td>
                      <td data-label="Description">{brand.description || "-"}</td>
                      <td data-label="Category">
                        {categories.find(cat => String(cat.id) === String(brand.category_id))?.name || "-"}
                      </td>
                      <td
                        data-label="Action"
                        className="d-flex justify-content-center justify-content-md-start align-items-center gap-2"
                      >
                        <Link  to={`/inventory/brand/editbrand/${brand.id}`} className="icon-edit" title="Edit">
                          <BorderColorOutlinedIcon />
                        </Link>
                        <Link  to="#" className="icon-delete" onClick={() => handleDelete(brand.id)} title="Delete">
                          <AutoDeleteOutlinedIcon />
                        </Link>
                        <Link  to={`/inventory/brand/showbrand/${brand.id}`} className="icon-view" title="View">
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

export default ListBrand;
