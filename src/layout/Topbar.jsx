import React from "react";

const Topbar = () => {
  return (
    <div className="app-topstrip bg-dark py-6 px-3 w-100 d-lg-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center justify-content-center gap-5 mb-2 mb-lg-0">
        <a className="d-flex justify-content-center" href="#">
          <img
            src="/assets/images/logos/cart.png"
            alt="Logo"
            width="50"
          />
        </a>
      </div>

      <div className="d-lg-flex align-items-center gap-2">
        <h3 className="text-white mb-2 mb-lg-0 fs-5 text-center">
         
        </h3>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <div className="dropdown d-flex">
            <a
              className="btn btn-primary d-flex align-items-center gap-1"
              href="#"
              onClick={(e) => e.preventDefault()}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-shopping-cart fs-5"></i>
              Website
              <i className="ti ti-chevron-down fs-5"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
