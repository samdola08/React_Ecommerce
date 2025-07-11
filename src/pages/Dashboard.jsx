const Dashboard = () => {
  return (
    <>
      <div className="col-lg-8">
        <div className="card w-100">
          <div className="card-body">
            <div className="d-md-flex align-items-center">
              <div>
                <h4 className="card-title">Sales Overview</h4>
                <p className="card-subtitle">Ample admin Vs Pixel admin</p>
              </div>
              <div className="ms-auto">
                <ul className="list-unstyled mb-0">
                  <li className="list-inline-item text-primary">
                    <span className="round-8 text-bg-primary rounded-circle me-1 d-inline-block"></span>
                    Ample
                  </li>
                  <li className="list-inline-item text-info">
                    <span className="round-8 text-bg-info rounded-circle me-1 d-inline-block"></span>
                    Pixel Admin
                  </li>
                </ul>
              </div>
            </div>
            <div id="sales-overview" className="mt-4 mx-n6"></div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card overflow-hidden">
          <div className="card-body pb-0">
            <div className="d-flex align-items-start">
              <div>
                <h4 className="card-title">Weekly Stats</h4>
                <p className="card-subtitle">Average sales</p>
              </div>
              <div className="ms-auto">
                <div className="dropdown">
                  <a
                    href="javascript:void(0)"
                    className="text-muted"
                    id="year1-dropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="ti ti-dots fs-7"></i>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="year1-dropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="javascript:void(0)">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0)">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0)">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4 pb-3 d-flex align-items-center">
              <span className="btn btn-primary rounded-circle round-48 hstack justify-content-center">
                <i className="ti ti-shopping-cart fs-6"></i>
              </span>
              <div className="ms-3">
                <h5 className="mb-0 fw-bolder fs-4">Top Sales</h5>
                <span className="text-muted fs-3">Johnathan Doe</span>
              </div>
              <div className="ms-auto">
                <span className="badge bg-secondary-subtle text-muted">
                  +68%
                </span>
              </div>
            </div>
            <div className="py-3 d-flex align-items-center">
              <span className="btn btn-warning rounded-circle round-48 hstack justify-content-center">
                <i className="ti ti-star fs-6"></i>
              </span>
              <div className="ms-3">
                <h5 className="mb-0 fw-bolder fs-4">Best Seller</h5>
                <span className="text-muted fs-3">MaterialPro Admin</span>
              </div>
              <div className="ms-auto">
                <span className="badge bg-secondary-subtle text-muted">
                  +68%
                </span>
              </div>
            </div>
            <div className="py-3 d-flex align-items-center">
              <span className="btn btn-success rounded-circle round-48 hstack justify-content-center">
                <i className="ti ti-message-dots fs-6"></i>
              </span>
              <div className="ms-3">
                <h5 className="mb-0 fw-bolder fs-4">Most Commented</h5>
                <span className="text-muted fs-3">Ample Admin</span>
              </div>
              <div className="ms-auto">
                <span className="badge bg-secondary-subtle text-muted">
                  +68%
                </span>
              </div>
            </div>
            <div className="pt-3 mb-7 d-flex align-items-center">
              <span className="btn btn-secondary rounded-circle round-48 hstack justify-content-center">
                <i className="ti ti-diamond fs-6"></i>
              </span>
              <div className="ms-3">
                <h5 className="mb-0 fw-bolder fs-4">Top Budgets</h5>
                <span className="text-muted fs-3">Sunil Joshi</span>
              </div>
              <div className="ms-auto">
                <span className="badge bg-secondary-subtle text-muted">
                  +15%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-md-flex align-items-center">
              <div>
                <h4 className="card-title">Products Performance</h4>
                <p className="card-subtitle">Ample Admin Vs Pixel Admin</p>
              </div>
              <div className="ms-auto mt-3 mt-md-0">
                <select
                  className="form-select theme-select border-0"
                  aria-label="Default select example"
                >
                  <option value="1">March 2025</option>
                  <option value="2">March 2025</option>
                  <option value="3">March 2025</option>
                </select>
              </div>
            </div>
            <div className="table-responsive mt-4">
              <table className="table mb-0 text-nowrap varient-table align-middle fs-3">
                <thead>
                  <tr>
                    <th scope="col" className="px-0 text-muted">
                      Assigned
                    </th>
                    <th scope="col" className="px-0 text-muted">
                      Name
                    </th>
                    <th scope="col" className="px-0 text-muted">
                      Priority
                    </th>
                    <th scope="col" className="px-0 text-muted text-end">
                      Budget
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-0">
                      <div className="d-flex align-items-center">
                        <img
                          src="./assets/images/profile/user-3.jpg"
                          className="rounded-circle"
                          width="40"
                          alt="flexy"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bolder">Sunil Joshi</h6>
                          <span className="text-muted">Web Designer</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-0">Elite Admin</td>
                    <td className="px-0">
                      <span className="badge bg-info">Low</span>
                    </td>
                    <td className="px-0 text-dark fw-medium text-end">$3.9K</td>
                  </tr>
                  <tr>
                    <td className="px-0">
                      <div className="d-flex align-items-center">
                        <img
                          src="./assets/images/profile/user-5.jpg"
                          className="rounded-circle"
                          width="40"
                          alt="flexy"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bolder">Andrew McDownland</h6>
                          <span className="text-muted">Project Manager</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-0">Real Homes WP Theme</td>
                    <td className="px-0">
                      <span className="badge text-bg-primary">Medium</span>
                    </td>
                    <td className="px-0 text-dark fw-medium text-end">
                      $24.5K
                    </td>
                  </tr>
                  <tr>
                    <td className="px-0">
                      <div className="d-flex align-items-center">
                        <img
                          src="./assets/images/profile/user-6.jpg"
                          className="rounded-circle"
                          width="40"
                          alt="flexy"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bolder">Christopher Jamil</h6>
                          <span className="text-muted">SEO Manager</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-0">MedicalPro WP Theme</td>
                    <td className="px-0">
                      <span className="badge bg-warning">Hight</span>
                    </td>
                    <td className="px-0 text-dark fw-medium text-end">
                      $12.8K
                    </td>
                  </tr>
                  <tr>
                    <td className="px-0">
                      <div className="d-flex align-items-center">
                        <img
                          src="./assets/images/profile/user-7.jpg"
                          className="rounded-circle"
                          width="40"
                          alt="flexy"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bolder">Nirav Joshi</h6>
                          <span className="text-muted">Frontend Engineer</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-0">Hosting Press HTML</td>
                    <td className="px-0">
                      <span className="badge bg-danger">Low</span>
                    </td>
                    <td className="px-0 text-dark fw-medium text-end">$2.4K</td>
                  </tr>
                  <tr>
                    <td className="px-0">
                      <div className="d-flex align-items-center">
                        <img
                          src="./assets/images/profile/user-8.jpg"
                          className="rounded-circle"
                          width="40"
                          alt="flexy"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bolder">Micheal Doe</h6>
                          <span className="text-muted">Content Writer</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-0">Helping Hands WP Theme</td>
                    <td className="px-0">
                      <span className="badge bg-success">Low</span>
                    </td>
                    <td className="px-0 text-dark fw-medium text-end">$9.3K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-0">Recent Comments</h4>
          </div>
          <div
            className="comment-widgets scrollable mb-2 common-widget"
            style={{ height: "465px" }}
            data-simplebar=""
          >
            <div className="d-flex flex-row comment-row border-bottom p-3 gap-3">
              <div>
                <span>
                  <img
                    src="./assets/images/profile/user-3.jpg"
                    className="rounded-circle"
                    alt="user"
                    width="50"
                  />
                </span>
              </div>
              <div className="comment-text w-100">
                <h6 className="fw-medium">James Anderson</h6>
                <p className="mb-1 fs-2 text-muted">
                  Lorem Ipsum is simply dummy text of the printing and type
                  etting industry
                </p>
                <div className="comment-footer mt-2">
                  <div className="d-flex align-items-center">
                    <span
                      className="
                              badge
                              bg-info-subtle
                              text-info
                              
                            "
                    >
                      Pending
                    </span>
                    <span className="action-icons">
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-edit fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-check fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-heart fs-5"></i>
                      </a>
                    </span>
                  </div>
                  <span
                    className="
                            text-muted
                            ms-auto
                            fw-normal
                            fs-2
                            d-block
                            mt-2
                            text-end
                          "
                  >
                    April 14, 2025
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-row comment-row border-bottom active p-3 gap-3">
              <div>
                <span>
                  <img
                    src="./assets/images/profile/user-5.jpg"
                    className="rounded-circle"
                    alt="user"
                    width="50"
                  />
                </span>
              </div>
              <div className="comment-text active w-100">
                <h6 className="fw-medium">Michael Jorden</h6>
                <p className="mb-1 fs-2 text-muted">
                  Lorem Ipsum is simply dummy text of the printing and type
                  setting industry.
                </p>
                <div className="comment-footer mt-2">
                  <div className="d-flex align-items-center">
                    <span
                      className="
                              badge
                              bg-success-subtle
                              text-success
                              
                            "
                    >
                      Approved
                    </span>
                    <span className="action-icons active">
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-edit fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-circle-x fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-heart text-danger fs-5"></i>
                      </a>
                    </span>
                  </div>
                  <span
                    className="
                            text-muted
                            ms-auto
                            fw-normal
                            fs-2
                            text-end
                            mt-2
                            d-block
                          "
                  >
                    April 14, 2025
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-row comment-row border-bottom p-3 gap-3">
              <div>
                <span>
                  <img
                    src="./assets/images/profile/user-6.jpg"
                    className="rounded-circle"
                    alt="user"
                    width="50"
                  />
                </span>
              </div>
              <div className="comment-text w-100">
                <h6 className="fw-medium">Johnathan Doeting</h6>
                <p className="mb-1 fs-2 text-muted">
                  Lorem Ipsum is simply dummy text of the printing and type
                  setting industry.
                </p>
                <div className="comment-footer mt-2">
                  <div className="d-flex align-items-center">
                    <span
                      className="
                              badge
                              bg-danger-subtle
                              text-danger
                              
                            "
                    >
                      Rejected
                    </span>
                    <span className="action-icons">
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-edit fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-check fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-heart fs-5"></i>
                      </a>
                    </span>
                  </div>
                  <span
                    className="
                            text-muted
                            ms-auto
                            fw-normal
                            fs-2
                            d-block
                            mt-2
                            text-end
                          "
                  >
                    April 14, 2025
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-row comment-row p-3 gap-3">
              <div>
                <span>
                  <img
                    src="./assets/images/profile/user-4.jpg"
                    className="rounded-circle"
                    alt="user"
                    width="50"
                  />
                </span>
              </div>
              <div className="comment-text w-100">
                <h6 className="fw-medium">James Anderson</h6>
                <p className="mb-1 fs-2 text-muted">
                  Lorem Ipsum is simply dummy text of the printing and type
                  setting industry.
                </p>
                <div className="comment-footer mt-2">
                  <div className="d-flex align-items-center">
                    <span
                      className="
                              badge
                              bg-info-subtle
                              text-info
                              
                            "
                    >
                      Pending
                    </span>
                    <span className="action-icons">
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-edit fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-check fs-5"></i>
                      </a>
                      <a href="javascript:void(0)" className="ps-3">
                        <i className="ti ti-heart fs-5"></i>
                      </a>
                    </span>
                  </div>
                  <span
                    className="
                            text-muted
                            ms-auto
                            fw-normal
                            fs-2
                            d-block
                            text-end
                            mt-2
                          "
                  >
                    April 14, 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <h4 className="card-title mb-0">Weather Report</h4>
              <select className="form-select w-auto ms-auto">
                <option selected="">Today</option>
                <option value="1">Weekly</option>
              </select>
            </div>
            <div className="d-flex align-items-center flex-row mt-4">
              <div className="p-2 display-5 text-primary">
                <i className="ti ti-cloud-snow"></i>
                <span>
                  73<sup>°</sup>
                </span>
              </div>
              <div className="p-2">
                <h3 className="mb-0">Saturday</h3>
                <small>Ahmedabad, India</small>
              </div>
            </div>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>Wind</td>
                  <td className="fw-medium">ESE 17 mph</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td className="fw-medium">83%</td>
                </tr>
                <tr>
                  <td>Pressure</td>
                  <td className="fw-medium">28.56 in</td>
                </tr>
                <tr>
                  <td>Cloud Cover</td>
                  <td className="fw-medium">78%</td>
                </tr>
                <tr>
                  <td>Ceiling</td>
                  <td className="fw-medium">25760 ft</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <ul className="list-unstyled row text-center city-weather-days mb-0">
              <li className="col">
                <i className="ti ti-sun-high fs-4"></i>
                <span>09:30</span>
                <h3 className="mb-0 fs-6 lh-base">
                  70<sup>°</sup>
                </h3>
              </li>
              <li className="col">
                <i className="ti ti-cloud fs-4"></i>
                <span>11:30</span>
                <h3 className="mb-0 fs-6 lh-base">
                  72<sup>°</sup>
                </h3>
              </li>
              <li className="col">
                <i className="ti ti-cloud-rain fs-4"></i>
                <span>13:30</span>
                <h3 className="mb-0 fs-6 lh-base">
                  75<sup>°</sup>
                </h3>
              </li>
              <li className="col">
                <i className="ti ti-cloud-snow fs-4"></i>
                <span>15:30</span>
                <h3 className="mb-0 fs-6 lh-base">
                  76<sup>°</sup>
                </h3>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
