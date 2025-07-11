import React from "react";

const Footer = () => {
  return (
    <footer>
      <div
       
      >
        <div  className="col-md-3 part5 mt-5 d-flex align-items-center justify-content-between"
        style={{ gap: "1rem", width:"100%" }}>
          <h2>Follow us</h2>
          <ul className="list list-inline mb-0">
            <li className="list-inline-item">
              <a
                href="https://www.facebook.com/samdola8/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-facebook social-icon"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a
                href="https://www.instagram.com/nhr_dola/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram social-icon"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a
                href="https://x.com/Samsun_nahar_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-twitter social-icon"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a
                href="https://github.com/samdola08"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-github social-icon"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-youtube social-icon"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
