import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";

const ListWarehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ──────────────────────────────
     Fetch warehouses once on mount
     ────────────────────────────── */
  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch(
        // "http://localhost/ecommerce_app/laravel_backend/public/api/warehouses"
        "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/warehouses"
      );
      const data = await res.json();
      setWarehouses(data.warehouses || data); // supports {warehouses: []} or plain []
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  };

  /* ──────────────────────────────
     Delete
     ────────────────────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;

    try {
      const res = await fetch(
        // `http://localhost/ecommerce_app/laravel_backend/public/api/warehouses/${id}`,
        `http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/warehouses/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setWarehouses((prev) => prev.filter((wh) => wh.id !== id));

        // keep pagination sane if last item on page was removed
        const newTotalPages = Math.ceil((warehouses.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
      } else {
        alert("Failed to delete warehouse");
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      alert("Error deleting warehouse");
    }
  };

  /* ──────────────────────────────
     Pagination helpers
     ────────────────────────────── */
  const totalPages = Math.ceil(warehouses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWarehouses = warehouses.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* ──────────────────────────────
     Render
     ────────────────────────────── */
  return (
    <>
      {/* Header + “Add Warehouse” button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>List Of Warehouses</h2>
        <Link to="/warehouse/createwarehouse" className="btn2 btn-primary">
          <UploadOutlinedIcon /> &nbsp; Add Warehouse
        </Link>
      </div>
      <hr />

      {/* Table */}
      <div className="card shadow-sm" style={{ width: "97%", margin: "auto" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-table">
              <thead className="table-light d-md-table-header-group">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentWarehouses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No warehouses found.
                    </td>
                  </tr>
                ) : (
                  currentWarehouses.map((wh) => (
                    <tr
                      key={wh.id}
                      className="d-block d-md-table-row mb-3 mb-md-0 warehouse-row"
                    >
                      <td data-label="ID">{wh.id}</td>
                      <td data-label="Name">{wh.name}</td>
                      <td data-label="Location">{wh.location}</td>

                      <td
                        data-label="Action"
                        className="d-flex justify-content-center justify-content-md-start align-items-center gap-2"
                      >
                        <Link
                          to={`/warehouse/editwarehouse/${wh.id}`}
                          className="icon-edit"
                          title="Edit"
                        >
                          <BorderColorOutlinedIcon />
                        </Link>

                        <Link
                          to="#"
                          className="icon-delete"
                          onClick={() => handleDelete(wh.id)}
                          title="Delete"
                        >
                          <AutoDeleteOutlinedIcon />
                        </Link>

                        <Link
                          to={`/warehouse/showwarehouse/${wh.id}`}
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
        <nav aria-label="Page navigation" className="p-3 d-flex justify-content-center">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                &laquo;
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => goToPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ListWarehouse;
