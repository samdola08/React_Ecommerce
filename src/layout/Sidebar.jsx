import React from "react";
import { Link } from "react-router-dom";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import Shop2OutlinedIcon from "@mui/icons-material/Shop2Outlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const Sidebar = () => {
  return (
    <aside className="left-sidebar" style={{ top: "0px" }}>
      <div>
        <div
          className="brand-logo d-flex align-items-center justify-content-between"
          style={{ background: "rgba(25, 42, 86,1.0)" }}
        >
          {/* <div className="brand-logo d-flex align-items-center justify-content-between" style={{background:'rgb(3, 65, 88)'}}> */}
          <Link
            to="/"
            className="text-nowrap logo-img d-flex "
            style={{ marginLeft: "-18px" }}
          >
            <img src="/assets/images/logos/logo3.png" alt="logo" width={160} />
          </Link>
          <Link style={{ marginRight: "-18px" }}>
            {" "}
            <img src="/assets/images/logos/cart.png" alt="cart" height={43} />
          </Link>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
          >
            <i className="ti ti-x fs-6"></i>
          </div>
        </div>

        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <iconify-icon
                icon="solar:menu-dots-linear"
                className="nav-small-cap-icon fs-4"
              ></iconify-icon>
              <span className="hide-menu">Home</span>
            </li>

            <li className="sidebar-item">
              <Link to="/" className="sidebar-link">
                <i className="ti ti-atom"></i>
                <span className="hide-menu">Dashboard</span>
              </Link>
            </li>

            {/* Dropdown Example */}
            <li className="sidebar-item">
              <a
                className="sidebar-link justify-content-between has-arrow"
                href="#"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="d-flex">
                    <i className="fa-solid fa-cart-flatbed"></i>
                  </span>
                  <span className="hide-menu">Inventory</span>
                </div>
              </a>
              <ul aria-expanded="false" className="collapse first-level">
                <li className="sidebar-item">
                  <Link
                    to="/inventory/category/listcategory"
                    className="sidebar-link"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-list"></i>
                      <span className="hide-menu">Category</span>
                    </div>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link
                    to="/inventory/brand/listbrand"
                    className="sidebar-link"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-copyright"></i>
                      <span className="hide-menu">Brand</span>
                    </div>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link
                    to="/inventory/product/listproduct"
                    className="sidebar-link"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <i className="ti ti-circle"></i>
                      <span className="hide-menu">Product</span>
                    </div>
                  </Link>
                </li>

                {/* Add more menu items similarly */}
              </ul>
            </li>
            <li className="sidebar-item">
              <a
                className="sidebar-link justify-content-between has-arrow"
                href="#"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="d-flex">
                    <Shop2OutlinedIcon />
                  </span>
                  <span className="hide-menu">Purchase</span>
                </div>
              </a>
              <ul aria-expanded="false" className="collapse first-level">
                <li className="sidebar-item">
                  <Link to="/purchase/listpurchase" className="sidebar-link">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-list"></i>
                      <span className="hide-menu">Purchase List</span>
                    </div>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/purchase/createpurchase" className="sidebar-link">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-copyright"></i>
                      <span className="hide-menu">Add Purchase</span>
                    </div>
                  </Link>
                </li>

                {/* Add more menu items similarly */}
              </ul>
            </li>
            <li className="nav-small-cap">
              <iconify-icon
                icon="solar:menu-dots-linear"
                className="nav-small-cap-icon fs-4"
              ></iconify-icon>
              <span className="hide-menu">Shop</span>
            </li>
            <li className="sidebar-item">
              <Link to="customer/listcustomer" className="sidebar-link">
                <PersonOutlineOutlinedIcon />
                <span className="hide-menu">Customer</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <a
                className="sidebar-link justify-content-between has-arrow"
                href="#"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="d-flex">
                    <i className="fa-solid fa-cart-flatbed"></i>
                  </span>
                  <span className="hide-menu">Order</span>
                </div>
              </a>
              <ul aria-expanded="false" className="collapse first-level">
                <li className="sidebar-item">
                  <Link to="/order/listorder" className="sidebar-link">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-list"></i>
                      <span className="hide-menu">Order List</span>
                    </div>
                  </Link>
                </li>

                {/* Add more menu items similarly */}
              </ul>
            </li>
            <li className="sidebar-item">
              <Link to="delivery/listdelivery" className="sidebar-link">
                <i className="fa-solid fa-truck-field-un"></i>
                <span className="hide-menu">Delivery</span>
              </Link>
            </li>
            <li>
              <span className="sidebar-divider lg"></span>
            </li>
            <li className="nav-small-cap">
              <iconify-icon
                icon="solar:menu-dots-linear"
                className="nav-small-cap-icon fs-4"
              ></iconify-icon>
              <span className="hide-menu">Logistics</span>
            </li>

            <li className="sidebar-item">
              <Link to="supplier/listsupplier" className="sidebar-link">
                <i className="fa-solid fa-truck-field-un"></i>
                <span className="hide-menu">Supplier</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="stock/liststock" className="sidebar-link">
                <i className="fa-solid fa-boxes-stacked"></i>
                <span className="hide-menu">Stock</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="warehouse/listwarehouse" className="sidebar-link">
                <FactoryOutlinedIcon />
                <span className="hide-menu">WareHouse</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
