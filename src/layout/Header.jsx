import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="app-header" style={{background:'rgba(25, 42, 86,1.0)', top:'0px'}}>
    {/* <header className="app-header" style={{background:'rgb(3, 65, 88) ', top:'0px'}}> */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <a className="nav-link sidebartoggler" id="headerCollapse" href="#">
              <i className="ti ti-menu-2" style={{color:'white'}}></i>
            </a>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link"
              href="#"
              id="drop1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-bell" style={{color:'#d9bf70'}}></i>

              <div className="notification rounded-circle" style={{color:'white'}}></div>
            </a>
            <div className="dropdown-menu dropdown-menu-animate-up" aria-labelledby="drop1">
              <div className="message-body">
                <a href="#" className="dropdown-item">Item 1</a>
                <a href="#" className="dropdown-item">Item 2</a>
              </div>
            </div>
          </li>
        </ul>

        <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
          <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
            <li className="nav-item dropdown">
              <a
                className="nav-link"
                href="#"
                id="drop2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/assets/images/profile/user-1.jpg"
                  alt="user"
                  width="35"
                  height="35"
                  className="rounded-circle"
                />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                aria-labelledby="drop2"
              >
                <div className="message-body">
                  <Link to="/profile" className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-user fs-6"></i>
                    <p className="mb-0 fs-3">My Profile</p>
                  </Link>
                  <Link to="/account" className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-mail fs-6"></i>
                    <p className="mb-0 fs-3">My Account</p>
                  </Link>
                  <Link to="/tasks" className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-list-check fs-6"></i>
                    <p className="mb-0 fs-3">My Task</p>
                  </Link>
                  <Link to="/login" className="btn btn-outline-primary mx-3 mt-2 d-block">
                    Logout
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
