// src/pages/order/CreateOrder.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import "./create.css";

/* ─── helpers (integer‑only) ─────────────────────── */
const rd = (v) => Math.round(Number(v) || 0); // .5↑ , .49↓
const today = () => new Date().toISOString().slice(0, 10);
// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

export default function CreateOrder() {
  /* look‑ups */
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  /* header */
  const [header, setHeader] = useState({
    customer_id: "",
    order_date: today(),
    delivery_date: today(),
    shipping_address: "",
    note: "",
    discount_amount: 0,
    vat_amount: 0,
  });

  /* items */
  const blankItem = { product_id: "", quantity: 1, unit_price: 0, discount: 0, tax: 0 };
  const [items, setItems] = useState([blankItem]);
  const updateItem = (i, k, v) =>
    setItems((prev) => prev.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const discAmt = (it) => rd((rd(it.discount) / 100) * rd(it.unit_price) * rd(it.quantity));
  const taxAmt = (it) => rd((rd(it.tax) / 100) * (rd(it.unit_price) * rd(it.quantity) - discAmt(it)));
  const subTot = (it) => rd(rd(it.unit_price) * rd(it.quantity) - discAmt(it) + taxAmt(it));

  /* payments */
  const blankPay = { payment_date: today(), amount: 0, method: "cash", note: "" };
  const [payments, setPayments] = useState([blankPay]);
  const updatePayment = (i, k, v) =>
    setPayments((prev) => prev.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  /* totals */
const itemsTotal = items.reduce((s, it) => s + subTot(it), 0);
const vatAmount = Number(header.vat_amount) || 0;
const discountAmount = Number(header.discount_amount) || 0;
const grandTotal = itemsTotal + vatAmount - discountAmount;
const paidAmount = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
const dueAmount = grandTotal - paidAmount;

  /* fetch refs */
  useEffect(() => {
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch(`${API}/customers`).then((r) => r.json()),
          fetch(`${API}/products`).then((r) => r.json()),
        ]);
        setCustomers(cRes.customers ?? cRes.data ?? cRes ?? []);
        setProducts(pRes.products ?? pRes.data ?? pRes ?? []);
      } catch (e) {
        console.error("Lookup error", e);
      }
    })();
  }, []);

  /* submit */
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...header,
      discount_amount: rd(header.discount_amount),
      vat_amount: rd(header.vat_amount),
      paid_amount: rd(paidAmount),
      items: items.map((it) => ({
        ...it,
        product_id: Number(it.product_id),
        quantity: rd(it.quantity),
        unit_price: rd(it.unit_price),
        discount: rd(it.discount),
        tax: rd(it.tax),
        subtotal: subTot(it),
      })),
      payments: payments.map((p) => ({ ...p, amount: rd(p.amount) })),
    };

    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (res.ok) {
        setMsg("Order saved successfully!");
        setTimeout(() => nav("/order/listorder"), 1200);
      } else {
        setMsg(body.message || "Failed to save order");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  /* ─── UI ───────────────────────────────────────── */
  return (
    <>
      {/* breadcrumb */}
      <div className="card">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Create Order</h2>
          <Breadcrumbs separator="›">
            <MUILink component={Link} to="/" underline="hover">
              <HomeOutlinedIcon sx={{ mr: 0.5 }} /> Dashboard
            </MUILink>
            <MUILink component={Link} to="/order/listorder" underline="hover">
              Orders
            </MUILink>
            <Typography color="text.primary">Add Order</Typography>
          </Breadcrumbs>
        </div>
      </div>
      <hr />

      <form onSubmit={handleSubmit}>
        {/* header card */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 style={{ color: "#034158" }} className="mb-3">
              Order Details
            </h4>
            <div className="row3 g-2">
              <div className="col-md-4">
                <label>Customer *</label>
                <select
                  className="form-control"
                  required
                  value={header.customer_id}
                  onChange={(e) => setHeader({ ...header, customer_id: e.target.value })}
                >
                  <option value="">-- Select --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label>Order Date *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={header.order_date}
                  onChange={(e) => setHeader({ ...header, order_date: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label>Delivery Date *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={header.delivery_date}
                  onChange={(e) => setHeader({ ...header, delivery_date: e.target.value })}
                />
              </div>
            </div>
            <div className="row3 g-2 mt-2">
              <div className="col-md-6">
                <label>Shipping Address *</label>
                <input
                  className="form-control"
                  required
                  value={header.shipping_address}
                  onChange={(e) => setHeader({ ...header, shipping_address: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label>Note</label>
                <input
                  className="form-control"
                  value={header.note}
                  onChange={(e) => setHeader({ ...header, note: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* items table */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 style={{ color: "#034158" }} className="mb-3">
              Items
            </h4>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "25%" }}>Product</th>
                    <th style={{ width: "7%" }}>Qty</th>
                    <th style={{ width: "10%" }}>Unit Price</th>
                    <th style={{ width: "10%" }}>Discount%</th>
                    <th style={{ width: "11%" }}>Discount Amt</th>
                    <th style={{ width: "8%" }}>Tax %</th>
                    <th style={{ width: "11%" }}>Tax Amt</th>
                    <th style={{ width: "11%" }}>Subtotal</th>
                    <th style={{ width: "7%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td>
                        <select
                          className="form-select"
                          required
                          value={it.product_id}
                          onChange={(e) => updateItem(idx, "product_id", e.target.value)}
                        >
                          <option value="">-- Select --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="form-control"
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="form-control"
                          value={it.unit_price}
                          onChange={(e) => updateItem(idx, "unit_price", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          className="form-control"
                          value={it.discount}
                          onChange={(e) => updateItem(idx, "discount", e.target.value)}
                        />
                      </td>
                      <td>{discAmt(it)}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="form-control"
                          value={it.tax}
                          onChange={(e) => updateItem(idx, "tax", e.target.value)}
                        />
                      </td>
                      <td>{taxAmt(it)}</td>
                      <td>{subTot(it)}</td>
                      <td className="text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            <RemoveCircleOutlineIcon fontSize="small" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setItems((prev) => [...prev, blankItem])}>
              <AddCircleOutlineIcon /> Add Item
            </button>

            {/* totals */}
            <div className="row g-2 mt-3">
              <div className="col-md-3">
                <label>Order Discount (amount)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  value={header.discount_amount}
                  onChange={(e) => setHeader({ ...header, discount_amount: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label>Order VAT (amount)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  value={header.vat_amount}
                  onChange={(e) => setHeader({ ...header, vat_amount: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Paid Amount (sum)</label>
                <input readOnly className="form-control" value={paidAmount} />
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Due Amount</label>
                <input readOnly className="form-control" value={dueAmount} />
              </div>
            </div>

            <div className="text-end mt-3">
              <h5>Total : {grandTotal} ৳</h5>
            </div>
          </div>
        </div>

        {/* payments */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 style={{ color: "#034158" }} className="mb-3">
              Payment Details
            </h4>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Note</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={p.payment_date}
                          onChange={(e) => updatePayment(idx, "payment_date", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="form-control"
                          value={p.amount}
                          onChange={(e) => updatePayment(idx, "amount", e.target.value)}
                        />
                      </td>
                      <td>
                        <select className="form-select" value={p.method} onChange={(e) => updatePayment(idx, "method", e.target.value)}>
                          {[
                            "cash",
                            "bank",
                            "cheque",
                            "card",
                            "mobile",
                            "other",
                          ].map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input className="form-control" value={p.note} onChange={(e) => updatePayment(idx, "note", e.target.value)} />
                      </td>
                      <td className="text-center">
                        {payments.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setPayments((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            <RemoveCircleOutlineIcon fontSize="small" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setPayments((p) => [...p, blankPay])}>
              <AddCircleOutlineIcon /> Add Payment
            </button>
          </div>
        </div>

        {/* submit bar */}
        <div className="card">
          <div className="card-footer d-flex justify-content-between">
            <button type="submit" className="btn2 btn-icon" disabled={dueAmount > 0}>
              <DownloadDoneOutlinedIcon /> Submit
            </button>
            <Link to="/order/listorder" className="btn3 btn-icon">
              <ClearOutlinedIcon /> Cancel
            </Link>
          </div>
        </div>

        {msg && <div className="alert alert-info m-3">{msg}</div>}
      </form>
    </>
  );
}