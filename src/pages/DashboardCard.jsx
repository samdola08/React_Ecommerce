import React, { useState, useEffect } from "react";
import "./DashboardCard.css"; // your custom CSS

const useCountUp = (value, duration = 1000) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    const increment = end / (duration / 16);

    const frame = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(Math.floor(start));
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [value, duration]);

  return count;
};

const Card = ({ title, value, bgColor, iconClass }) => {
  let numericValue = 0;
  try {
    numericValue = parseFloat(value.toString().replace(/[^\d.]/g, ""));
    if (isNaN(numericValue)) numericValue = 0;
  } catch {
    numericValue = 0;
  }

  const count = useCountUp(numericValue);
  const isCurrency = typeof value === "string" && value.includes("৳");

  return (
    <div className={`dashboard-card ${bgColor}`}>
      <h2 className="card-title">
        {iconClass && <i className={`${iconClass} card-icon`}></i>} {title}
      </h2>
      <p className="card-value">
        {isCurrency ? `৳${count.toLocaleString()}` : count.toLocaleString()}
      </p>
    </div>
  );
};

const DashboardCards = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch("http://localhost/ecommerce_app/laravel_backend/public/api/dashboard/summary")
    fetch("http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api/dashboard/summary")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-message">Loading dashboard data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

const cards = [
  { title: "Total Orders", value: data.orders.count, bgColor: "bg-primary", iconClass: "fas fa-shopping-cart" },
  { title: "Order Due", value: `৳${data.orders.due}`, bgColor: "bg-danger", iconClass: "fas fa-money-bill-wave" },
  { title: "Total Purchases", value: data.purchases.count, bgColor: "bg-success", iconClass: "fas fa-shopping-bag" },
  { title: "Purchase Due", value: `৳${data.purchases.due}`, bgColor: "bg-warning", iconClass: "fas fa-file-invoice-dollar" },
  { title: "Invoices", value: data.invoices.count, bgColor: "bg-purple-dark", iconClass: "fas fa-file-invoice" },
  { title: "Invoice Due", value: `৳${data.invoices.due}`, bgColor: "bg-danger", iconClass: "fas fa-money-bill-wave" },
  { title: "Deliveries", value: data.deliveries.count, bgColor: "bg-info", iconClass: "fas fa-truck" },
  { title: "Deliveries Done", value: data.deliveries.completed, bgColor: "bg-accent", iconClass: "fas fa-boxes" },
  { title: "Customers", value: data.customers, bgColor: "bg-secondary", iconClass: "fas fa-users" },
  { title: "Suppliers", value: data.suppliers, bgColor: "bg-muted", iconClass: "fas fa-user-tie" },
];

  return (
    <div className="dashboard-grid">
      {cards.map(({ title, value, bgColor, iconClass }, idx) => (
        <Card key={idx} title={title} value={value} bgColor={bgColor} iconClass={iconClass} />
      ))}
    </div>
  );
};

export default DashboardCards;
