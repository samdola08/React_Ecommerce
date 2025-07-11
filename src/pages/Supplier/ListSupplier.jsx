import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Pagination from "../../components/Pagination";


const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
// const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public/api";

const ListSupplier = () => {
  const [suppliers, setSuppliers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ─────────────────────────────
     Fetch suppliers on mount
     ──────────────────────────── */
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/suppliers`);
      const raw  = await res.json();
      const list = raw.suppliers || raw;

      /* Normalise: ensure every object has company_name */
      const normalised = list.map((s) => ({
        ...s,
        company_name:
          s.company_name ??           // 1st preference
          s.company ??                // fall‑backs
          s.companyName ??
          "",
      }));

      setSuppliers(normalised);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────
     Delete supplier
     ──────────────────────────── */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete supplier "${name}"?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/suppliers/${id}`, { method: "DELETE" });

      if (res.ok) {
        const updated = suppliers.filter((sup) => sup.id !== id);
        setSuppliers(updated);

        const newTotalPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
      } else {
        alert("Failed to delete supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Error deleting supplier");
    }
  };

  /* ─────────────────────────────
     Search + pagination helpers
     ──────────────────────────── */
  const filteredSuppliers = suppliers.filter(
    (sup) =>
      sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages    = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex    = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* ─────────────────────────────
     Render
     ──────────────────────────── */
  return (
    <>
      {/* Header + Add button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>List Of Suppliers</h2>
        <Link to="/supplier/createsupplier" className="btn2 btn-primary">
          <UploadOutlinedIcon /> &nbsp; Add Supplier
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or company..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <hr />

      {/* Table */}
      <div className="card shadow-sm" >
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-table">
              <thead className="table-light d-md-table-header-group">
                <tr >
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading suppliers...
                    </td>
                  </tr>
                ) : currentSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  currentSuppliers.map((sup) => (
                    <tr key={sup.id} className="d-block d-md-table-row mb-3 mb-md-0 supplier-row">
                      <td data-label="ID">{sup.id}</td>
                      <td data-label="Company Name">{sup.company_name}</td>
                      <td data-label="Name">{sup.name}</td>
                      <td data-label="Phone">{sup.phone}</td>
                      <td data-label="Email">{sup.email}</td>
                      <td data-label="Address">{sup.address}</td>
                      <td
                        data-label="Action"
                        className="d-flex justify-content-center justify-content-md-start align-items-center gap-2"
                      >
                        <Link
                          to={`/supplier/editsupplier/${sup.id}`}
                          className="icon-edit"
                          title="Edit"
                        >
                          <BorderColorOutlinedIcon />
                        </Link>
                        <Link
                          to="#"
                          className="icon-delete"
                          onClick={() => handleDelete(sup.id, sup.name)}
                          title="Delete"
                        >
                          <AutoDeleteOutlinedIcon />
                        </Link>
                        <Link
                          to={`/supplier/showsupplier/${sup.id}`}
                          className="icon-view"
                          title="View"
                        >
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
       <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ListSupplier;
