import React, { useEffect, useState } from "react";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { Link, useNavigate } from "react-router-dom";

// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

export default function CreateDelivery() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    delivery_person: "",
    delivery_company: "",
    delivery_note: "",
    delivery_date: new Date().toISOString().slice(0, 10),
    warehouse_id: "",
  });

  const nav = useNavigate();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API}/orders`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || data || [];
        setOrders(list);
      });
  }, []);

  useEffect(() => {
    setMsg(""); // clear message when changing orders
    if (selectedOrderId) {
      fetch(`${API}/orders/${selectedOrderId}/items`)
        .then((res) => res.json())
        .then((data) => {
          setItems(data.items || []);
        });
    }
  }, [selectedOrderId]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleQtyChange = (index, value) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === index ? { ...it, quantity: value } : it))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      order_id: selectedOrderId,
      items: items.map((it) => ({
        product_id: it.product_id,
        quantity: parseInt(it.quantity, 10),
      })),
    };

    try {
      const res = await fetch(`${API}/orders/${selectedOrderId}/delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload), // ✅ Now properly placed
      });

      const contentType = res.headers.get("content-type") || "";

      let data;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        setMsg("Unexpected server response.");
        return;
      }

      if (res.ok) {
        setMsg("✅ Delivery saved successfully!");
        setTimeout(() => nav("/delivery/listdelivery"), 1000);
      } else {
        setMsg(data.message || "❌ Failed to save delivery.");
      }
    } catch (err) {
      console.error(err);
      setMsg("⚠️ Server error.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Delivery</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label>Order *</label>
          <select
            required
            className="form-select"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
          >
            <option value="">-- Select Order --</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.id} - {o.order_no}
              </option>
            ))}
          </select>
        </div>

        {selectedOrderId && (
          <>
            <div className="mb-3">
              <label>Delivery Person *</label>
              <input
                type="text"
                name="delivery_person"
                required
                className="form-control"
                value={form.delivery_person}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Company</label>
              <input
                type="text"
                name="delivery_company"
                className="form-control"
                value={form.delivery_company}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Delivery Date *</label>
              <input
                type="date"
                name="delivery_date"
                required
                className="form-control"
                value={form.delivery_date}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Warehouse *</label>
              <input
                type="number"
                name="warehouse_id"
                required
                className="form-control"
                value={form.warehouse_id}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Note</label>
              <textarea
                name="delivery_note"
                className="form-control"
                value={form.delivery_note}
                onChange={handleChange}
              ></textarea>
            </div>

            <h5>Products</h5>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.product_name}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) =>
                          handleQtyChange(
                            idx,
                            parseInt(e.target.value, 10) || 1
                          )
                        }
                        className="form-control"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="card">
              <div className="card-footer d-flex justify-content-between">
                <button type="submit" className="btn2 btn-primary">
                  Save Delivery
                </button>
                <Link to="/delivery/listdelivery" className="btn3 btn-icon">
                  <ClearOutlinedIcon /> Cancel
                </Link>
              </div>
            </div>
          </>
        )}

        {msg && <div className="alert alert-info mt-3">{msg}</div>}
      </form>
    </div>
  );
}
