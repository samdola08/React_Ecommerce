import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Pagination from "../../components/Pagination";

// const BASE = "http://localhost/ecommerce_app/laravel_backend/public/api";
const BASE = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

const ListCustomer = () => {
  const [customers, setCustomers]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ── fetch customers once ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${BASE}/customers`);
        const raw  = await res.json();
        const list = raw.customers || raw;
        setCustomers(list);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── delete ── */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer "${name}"?`)) return;
    try {
      const res = await fetch(`${BASE}/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        const updated = customers.filter((c) => c.id !== id);
        setCustomers(updated);
        /* keep pagination valid */
        const lastPage = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > lastPage) setCurrentPage(lastPage || 1);
      } else {
        alert("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Server error");
    }
  };

  /* ── search & pagination helpers ── */
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages      = Math.ceil(filtered.length / itemsPerPage);
  const startIndex      = (currentPage - 1) * itemsPerPage;
  const currentDisplay  = filtered.slice(startIndex, startIndex + itemsPerPage);

  /* ── render ── */
  return (
    <>
      {/* header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold" style={{ color: "#034158" }}>List of Customers</h2>
        <Link to="/customer/createcustomer" className="btn2 btn-primary">
          <UploadOutlinedIcon /> &nbsp; Add Customer
        </Link>
      </div>

      {/* search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <hr />

      {/* table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-table">
              <thead className="table-light d-md-table-header-group">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone no.</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading…</td></tr>
                ) : currentDisplay.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">No customers found.</td></tr>
                ) : (
                  currentDisplay.map((c) => (
                    <tr key={c.id} className="d-block d-md-table-row mb-3 mb-md-0">
                      <td data-label="ID">{c.id}</td>
                      <td data-label="Name">{c.name}</td>
                      <td data-label="Phone">{c.phone}</td>
                      <td data-label="Email">{c.email || "-"}</td>
                      <td data-label="Status">{c.status}</td>
                      <td data-label="Address">{c.address || "-"}</td>
                      <td
                        data-label="Action"
                        className="d-flex justify-content-center justify-content-md-start align-items-center gap-2"
                      >
                        <Link to={`/customer/editcustomer/${c.id}`} className="icon-edit" title="Edit">
                          <BorderColorOutlinedIcon />
                        </Link>
                        <Link to="#" className="icon-delete" onClick={() => handleDelete(c.id, c.name)} title="Delete">
                          <AutoDeleteOutlinedIcon />
                        </Link>
                        <Link to={`/customer/showcustomer/${c.id}`} className="icon-view" title="View">
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

        {/* pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ListCustomer;
