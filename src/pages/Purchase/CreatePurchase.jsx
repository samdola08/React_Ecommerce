import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import "./create.css";

/* ------------------- helpers ------------------- */
const rd = (n) => Math.round(Number(n) || 0); // “round to nearest”

/* switch LOCAL vs SERVER API easily */
// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

export default function CreatePurchase() {
  /* ------------ lookup data ------------ */
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, wRes, pRes] = await Promise.all([
          fetch(`${API}/suppliers`),
          fetch(`${API}/warehouses`),
          fetch(`${API}/products`),
        ]);
        setSuppliers((await sRes.json()).suppliers || []);
        setWarehouses((await wRes.json()).warehouses || []);
        setProducts((await pRes.json()).products || []);
      } catch (err) {
        console.error("Lookup error:", err);
      }
    })();
  }, []);

  /* ------------- form header ------------- */
  const [header, setHeader] = useState({
    supplier_id: "",
    warehouse_id: "",
    purchase_date: new Date().toISOString().slice(0, 10),
    reference: `PUR-${Date.now()}`,
    purchase_no: `PNO-${Date.now()}`,
    invoice_number: `INV-${Date.now()}`,
    note: "",
    shipping: 0,
    order_tax: 0,
    paid_amount: "0",
  });

  /* ------------- items ------------------- */
  const blankItem = {
    product_id: "",
    quantity: 1,
    unit_cost: 0,
    discount: 0,
    tax_percent: 0,
  };
  const [items, setItems] = useState([blankItem]);

  const updateItem = (idx, key, val) =>
    setItems((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [key]: val } : row))
    );

  const addItem = () => setItems((prev) => [...prev, blankItem]);
  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  /* ----- per‑item calculations (rounded) ----- */
  const discAmt = (it) => {
    const qty = rd(it.quantity);
    const cost = rd(it.unit_cost);
    const dPct = Number(it.discount) || 0;
    return rd((dPct / 100) * qty * cost);
  };

  const subTot = (it) => {
    const qty = rd(it.quantity);
    const cost = rd(it.unit_cost);
    const price = qty * cost;
    const dAmt = discAmt(it);
    const taxP = Number(it.tax_percent) || 0;
    const tAmt = rd((taxP / 100) * (price - dAmt));
    return rd(price - dAmt + tAmt);
  };

  /* ------------- payments ---------------- */
  const blankPay = {
    payment_date: new Date().toISOString().slice(0, 10),
    amount: 0,
    method: "cash",
    reference_no: "",
    currency: "BDT",
    exchange_rate: 1,
    note: "",
  };
  const [payments, setPayments] = useState([blankPay]);

  const updatePayment = (idx, key, val) =>
    setPayments((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [key]: val } : p))
    );

  /* ------------- order‑level calcs ------------- */
  const totalItems = items.reduce((sum, it) => sum + subTot(it), 0);
  const shippingCost = rd(header.shipping);
  const orderTaxPct = Number(header.order_tax) || 0;
  const orderTaxAmt = rd((orderTaxPct / 100) * totalItems);
  const grandTotal = rd(totalItems + shippingCost + orderTaxAmt);
  const paidAmount = rd(header.paid_amount);
  const dueAmount = rd(grandTotal - paidAmount);

  /* ------------- submit ------------------ */
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...header,
      shipping: shippingCost,
      order_tax: orderTaxPct,
      paid_amount: paidAmount,
      items: items.map((it) => {
        const qty = rd(it.quantity);
        const cost = rd(it.unit_cost);
        const dPct = Number(it.discount) || 0;
        const dAmt = discAmt(it);
        const priceAfterDiscount = qty * cost - dAmt;
        const taxP = Number(it.tax_percent) || 0;
        const tAmt = rd((taxP / 100) * priceAfterDiscount);
        return {
          ...it,
          quantity: qty,
          unit_cost: cost,
          discount: dPct,
          tax_percent: taxP,
          discount_amount: dAmt,
          tax_amount: tAmt,
          subtotal: rd(priceAfterDiscount + tAmt),
        };
      }),
      payments: payments.map((p) => ({
        ...p,
        amount: rd(p.amount),
        exchange_rate: rd(p.exchange_rate),
      })),
    };

    try {
      const res = await fetch(`${API}/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setMsg("Purchase saved successfully!");
        setTimeout(() => nav("/purchase/listpurchase"), 1200);
      } else {
        setMsg(body.message || "Failed to save purchase");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  /* ------------- UI ------------- */
  return (
    <>
      {/* === Header / Breadcrumb === */}
      <div className="card">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>
            Create Purchase
          </h2>
          <Breadcrumbs separator="›">
            <MUILink component={Link} to="/" underline="hover">
              <HomeOutlinedIcon sx={{ mr: 0.5 }} />
              Dashboard
            </MUILink>
            <MUILink
              component={Link}
              to="/purchase/listpurchase"
              underline="hover"
            >
              Purchases
            </MUILink>
            <Typography color="text.primary">Add Purchase</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <hr />

      {/* === Main Form === */}
      <form onSubmit={handleSubmit}>
        {/* ----- Purchase Details ----- */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="mb-3" style={{ color: "#034158" }}>
              Purchase Details
            </h4>

            {/* row 1 */}
            <div className="row3 g-2">
              {/* supplier */}
              <div className="col-md-4">
                <label>Supplier *</label>
                <select
                  className="form-control"
                  value={header.supplier_id}
                  onChange={(e) =>
                    setHeader({ ...header, supplier_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* warehouse */}
              <div className="col-md-4">
                <label>Warehouse *</label>
                <select
                  className="form-control"
                  value={header.warehouse_id}
                  onChange={(e) =>
                    setHeader({ ...header, warehouse_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select --</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* date */}
              <div className="col-md-4">
                <label>Purchase Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={header.purchase_date}
                  onChange={(e) =>
                    setHeader({ ...header, purchase_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* row 2 */}
            <div className="row3 g-2 mt-2">
              {["reference", "purchase_no", "invoice_number"].map(
                (field, i) => (
                  <div className="col-md-4" key={field}>
                    <label>
                      {["Reference *", "Purchase No *", "Invoice Number *"][i]}
                    </label>
                    <input
                      className="form-control"
                      value={header[field]}
                      onChange={(e) =>
                        setHeader({ ...header, [field]: e.target.value })
                      }
                      required
                    />
                  </div>
                )
              )}
            </div>

            {/* note */}
            <div className="row3 mt-2">
              <div className="col-md-6">
                <label>Note</label>
                <input
                  className="form-control"
                  value={header.note}
                  onChange={(e) =>
                    setHeader({ ...header, note: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ----- Items ----- */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="mb-3" style={{ color: "#034158" }}>
              Items
            </h4>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "25%" }}>Product</th>
                    <th style={{ width: "7%" }}>Qty</th>
                    <th style={{ width: "10%" }}>Unit&nbsp;Cost</th>
                    <th style={{ width: "10%" }}>Discount&nbsp;%</th>
                    <th style={{ width: "11%" }}>Discount&nbsp;Amt</th>
                    <th style={{ width: "8%" }}>Tax&nbsp;%</th>
                    <th style={{ width: "11%" }}>Tax&nbsp;Amt</th>
                    <th style={{ width: "11%" }}>Subtotal</th>
                    <th style={{ width: "7%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      {/* product */}
                      <td>
                        <select
                          className="form-select"
                          value={it.product_id}
                          onChange={(e) =>
                            updateItem(idx, "product_id", e.target.value)
                          }
                          required
                        >
                          <option value="">-- Select --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      {/* qty */}
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={it.quantity}
                          onChange={(e) =>
                            updateItem(idx, "quantity", e.target.value)
                          }
                        />
                      </td>
                      {/* unit cost */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={it.unit_cost}
                          onChange={(e) =>
                            updateItem(idx, "unit_cost", e.target.value)
                          }
                        />
                      </td>
                      {/* discount pct */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control"
                          value={it.discount}
                          onChange={(e) =>
                            updateItem(idx, "discount", e.target.value)
                          }
                        />
                      </td>
                      {/* discount amt */}
                      <td>{discAmt(it)}</td>
                      {/* tax pct */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={it.tax_percent}
                          onChange={(e) =>
                            updateItem(idx, "tax_percent", e.target.value)
                          }
                        />
                      </td>
                      {/* tax amt */}
                      <td>
                        {rd(
                          ((Number(it.tax_percent) || 0) / 100) *
                            (rd(it.unit_cost) * rd(it.quantity) - discAmt(it))
                        )}
                      </td>
                      {/* subtotal */}
                      <td>{subTot(it)}</td>
                      {/* action */}
                      <td className="text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeItem(idx)}
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

            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={addItem}
            >
              <AddCircleOutlineIcon /> Add Item
            </button>

            {/* order‑level charges */}
            <div className="row g-2 mt-3">
              <div className="col-md-3">
                <label>Shipping Cost</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={header.shipping}
                  onChange={(e) =>
                    setHeader({ ...header, shipping: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <label>Order Tax %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={header.order_tax}
                  onChange={(e) =>
                    setHeader({ ...header, order_tax: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Paid Amount</label>
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  className="form-control"
                  value={header.paid_amount}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val > grandTotal) val = grandTotal;
                    setHeader({ ...header, paid_amount: val.toString() });
                  }}
                />
              </div>

              <div className="col-md-3">
                <label className="fw-bold">Due Amount</label>
                <input readOnly className="form-control" value={dueAmount} />
              </div>
            </div>

            <div className="text-end mt-3">
              <h5>Total&nbsp;: {grandTotal} ৳</h5>
            </div>
          </div>
        </div>

        {/* ----- Payments ----- */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="mb-3" style={{ color: "#034158" }}>
              Payment Details
            </h4>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Ref #</th>
                    <th>Currency</th>
                    <th>Rate</th>
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
                          onChange={(e) =>
                            updatePayment(idx, "payment_date", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={p.amount}
                          onChange={(e) =>
                            updatePayment(idx, "amount", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          value={p.method}
                          onChange={(e) =>
                            updatePayment(idx, "method", e.target.value)
                          }
                        >
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
                        <input
                          className="form-control"
                          value={p.reference_no}
                          onChange={(e) =>
                            updatePayment(idx, "reference_no", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={p.currency}
                          onChange={(e) =>
                            updatePayment(idx, "currency", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.0001"
                          className="form-control"
                          value={p.exchange_rate}
                          onChange={(e) =>
                            updatePayment(idx, "exchange_rate", e.target.value)
                          }
                        />
                      </td>
                      <td className="text-center">
                        {payments.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              setPayments((pay) =>
                                pay.filter((_, i) => i !== idx)
                              )
                            }
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

            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => setPayments((p) => [...p, blankPay])}
            >
              <AddCircleOutlineIcon /> Add Payment
            </button>
          </div>
        </div>

        {/* ----- submit bar ----- */}
        <div className="card">
          <div className="card-footer d-flex justify-content-between">
            <button
              type="submit"
              className="btn2 btn-icon"
              disabled={paidAmount > grandTotal}
            >
              <DownloadDoneOutlinedIcon /> Submit
            </button>
            <Link to="/purchase/listpurchase" className="btn3 btn-icon">
              <ClearOutlinedIcon /> Cancel
            </Link>
          </div>
        </div>

        {msg && <div className="alert alert-info m-3">{msg}</div>}
      </form>
    </>
  );
}
