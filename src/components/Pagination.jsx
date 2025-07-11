import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   if (totalPages <= 1) return null;

  const goPrev = () => onPageChange(currentPage - 1);
  const goNext = () => onPageChange(currentPage + 1);

  return (
    <nav aria-label="Page navigation" className="p-3 d-flex justify-content-center">
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={goPrev}>
            &laquo;
          </button>
        </li>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          );
        })}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={goNext}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
