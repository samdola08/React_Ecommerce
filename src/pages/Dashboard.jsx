import React, { useEffect, useState } from "react";
import DashboardCards from "./DashboardCard";

const WeeklyStat = ({ icon, bgColor, title, subtitle, percent }) => (
  <div className="d-flex align-items-center mb-3">
    <div className={`btn ${bgColor} rounded-circle round-48 hstack justify-content-center`}>
      <span style={{ fontSize: "1.5rem" }}>{icon}</span>
    </div>
    <div className="ms-3">
      <h5 className="mb-0 fw-bolder fs-4">{title}</h5>
      <span className="text-muted fs-3">{subtitle}</span>
    </div>
    <div className="ms-auto">
      <span className="badge bg-secondary-subtle text-muted">{percent}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setDashboardData({
        orders: { count: 1200, due: 23000 },
        purchases: { count: 950, due: 15000 },
        invoices: { count: 400, due: 10000 },
        deliveries: { count: 300, completed: 280 },
        customers: 1000,
        suppliers: 50,
      });
    }, 2000);
  }, []);

  return (
    <div className="container-fluid px-4 py-4">
      <DashboardCards data={dashboardData} />
      {/* <DashboardCards /> */}

      {/* Main row for cards */}
      <div className="row mt-4 gx-4 gy-4">

        {/* Sales Overview */}
        <div className="col-lg-8">
          <div className="card w-100">
            <div className="card-body">
              <div className="d-md-flex align-items-center">
                <div>
                  <h4 className="card-title">Sales Overview</h4>
                  <p className="card-subtitle">Ample admin Vs Pixel admin</p>
                </div>
                <div className="ms-auto">
                  <ul className="list-unstyled mb-0 d-flex gap-3">
                    <li className="text-primary d-flex align-items-center">
                      <span className="round-8 bg-primary rounded-circle me-1 d-inline-block"></span>
                      Ample
                    </li>
                    <li className="text-info d-flex align-items-center">
                      <span className="round-8 bg-info rounded-circle me-1 d-inline-block"></span>
                      Pixel Admin
                    </li>
                  </ul>
                </div>
              </div>
              <div id="sales-overview" className="mt-4 mx-n6" style={{ minHeight: 300 }}>
                {/* Chart goes here */}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="col-lg-4">
          <div className="card overflow-hidden">
            <div className="card-body pb-0">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Weekly Stats</h4>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ⋮
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
              </div>

              {/* Weekly Stats Items */}
              <WeeklyStat
                icon="🛒"
                bgColor="bg-primary"
                title="Top Sales"
                subtitle="Johnathan Doe"
                percent="+68%"
              />
              <WeeklyStat
                icon="⭐"
                bgColor="bg-warning"
                title="Best Seller"
                subtitle="MaterialPro Admin"
                percent="+68%"
              />
              <WeeklyStat
                icon="💬"
                bgColor="bg-success"
                title="Most Commented"
                subtitle="Ample Admin"
                percent="+68%"
              />
              <WeeklyStat
                icon="💎"
                bgColor="bg-secondary"
                title="Top Budgets"
                subtitle="Sunil Joshi"
                percent="+15%"
              />
            </div>
          </div>
        </div>

        {/* Products Performance Table */}
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
                    <option value="2">April 2025</option>
                    <option value="3">May 2025</option>
                  </select>
                </div>
              </div>
              <div className="table-responsive mt-4">
                <table className="table mb-0 text-nowrap varient-table align-middle fs-3">
                  <thead>
                    <tr>
                      <th scope="col" className="px-0 text-muted">Assigned</th>
                      <th scope="col" className="px-0 text-muted">Name</th>
                      <th scope="col" className="px-0 text-muted">Priority</th>
                      <th scope="col" className="px-0 text-muted text-end">Budget</th>
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
                      <td className="px-0"><span className="badge bg-info">Low</span></td>
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
                      <td className="px-0"><span className="badge text-bg-primary">Medium</span></td>
                      <td className="px-0 text-dark fw-medium text-end">$24.5K</td>
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
                      <td className="px-0"><span className="badge bg-warning">High</span></td>
                      <td className="px-0 text-dark fw-medium text-end">$12.8K</td>
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
                      <td className="px-0"><span className="badge bg-danger">Low</span></td>
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
                      <td className="px-0"><span className="badge bg-success">Low</span></td>
                      <td className="px-0 text-dark fw-medium text-end">$9.3K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Comments */}
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
              {/* Comment Row 1 */}
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
                    Lorem Ipsum is simply dummy text of the printing and type setting industry
                  </p>
                  <div className="comment-footer mt-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-info-subtle text-info">Pending</span>
                      <span className="action-icons">
                        <a href="#" className="ps-3"><i className="ti ti-edit fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-check fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-heart fs-5"></i></a>
                      </span>
                    </div>
                    <span className="text-muted ms-auto fw-normal fs-2 d-block mt-2 text-end">
                      April 14, 2025
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Row 2 */}
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
                    Lorem Ipsum is simply dummy text of the printing and type setting industry.
                  </p>
                  <div className="comment-footer mt-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-success-subtle text-success">Approved</span>
                      <span className="action-icons active">
                        <a href="#" className="ps-3"><i className="ti ti-edit fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-circle-x fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-heart text-danger fs-5"></i></a>
                      </span>
                    </div>
                    <span className="text-muted ms-auto fw-normal fs-2 text-end mt-2 d-block">
                      April 14, 2025
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Row 3 */}
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
                    Lorem Ipsum is simply dummy text of the printing and type setting industry.
                  </p>
                  <div className="comment-footer mt-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-danger-subtle text-danger">Rejected</span>
                      <span className="action-icons">
                        <a href="#" className="ps-3"><i className="ti ti-edit fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-check fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-heart fs-5"></i></a>
                      </span>
                    </div>
                    <span className="text-muted ms-auto fw-normal fs-2 d-block mt-2 text-end">
                      April 14, 2025
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Row 4 */}
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
                    Lorem Ipsum is simply dummy text of the printing and type setting industry.
                  </p>
                  <div className="comment-footer mt-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-info-subtle text-info">Pending</span>
                      <span className="action-icons">
                        <a href="#" className="ps-3"><i className="ti ti-edit fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-check fs-5"></i></a>
                        <a href="#" className="ps-3"><i className="ti ti-heart fs-5"></i></a>
                      </span>
                    </div>
                    <span className="text-muted ms-auto fw-normal fs-2 d-block text-end mt-2">
                      April 14, 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Report */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <h4 className="card-title mb-0">Weather Report</h4>
                <select className="form-select w-auto ms-auto">
                  <option>Today</option>
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
              <ul className="list-unstyled row text-center city-weather-days gap-3">
                <li className="col">
                  <div>Sun</div>
                  <i className="ti ti-sun fs-1 text-warning"></i>
                  <div>72°</div>
                </li>
                <li className="col">
                  <div>Mon</div>
                  <i className="ti ti-cloud fs-1 text-secondary"></i>
                  <div>69°</div>
                </li>
                <li className="col">
                  <div>Tue</div>
                  <i className="ti ti-cloud-rain fs-1 text-info"></i>
                  <div>71°</div>
                </li>
                <li className="col">
                  <div>Wed</div>
                  <i className="ti ti-cloud-snow fs-1 text-primary"></i>
                  <div>65°</div>
                </li>
                <li className="col">
                  <div>Thu</div>
                  <i className="ti ti-cloud-lightning fs-1 text-warning"></i>
                  <div>70°</div>
                </li>
                <li className="col">
                  <div>Fri</div>
                  <i className="ti ti-sun fs-1 text-warning"></i>
                  <div>74°</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
