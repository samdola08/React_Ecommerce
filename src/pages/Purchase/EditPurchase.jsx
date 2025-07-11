import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import "./create.css";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const rd = (n) => Math.round(Number(n) || 0);

// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

export default function EditPurchase() {
  const { id } = useParams();
  const nav = useNavigate();

  // Lookup data states
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  // Form states
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

  const blankItem = {
    product_id: "",
    quantity: 1,
    unit_cost: 0,
    discount: 0,
    tax_percent: 0,
  };
  const [items, setItems] = useState([blankItem]);

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

  const [msg, setMsg] = useState("");

  // Fetch lookup data on mount
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

  // Fetch purchase data by id on mount (for edit)
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`${API}/purchases/${id}`);
        if (!res.ok) throw new Error("Failed to fetch purchase");
        const data = await res.json();

        if (data.success) {
          const purchase = data.purchase;

          setHeader({
            supplier_id: purchase.supplier_id || "",
            warehouse_id: purchase.warehouse_id || "",
            purchase_date: purchase.purchase_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            reference: purchase.reference || "",
            purchase_no: purchase.purchase_no || "",
            invoice_number: purchase.invoice_number || "",
            note: purchase.note || "",
            shipping: purchase.shipping || 0,
            order_tax: purchase.order_tax || 0,
            paid_amount: purchase.paid_amount || 0,
          });

          if (purchase.items && purchase.items.length > 0) {
            setItems(
              purchase.items.map((item) => ({
                product_id: item.product_id || "",
                quantity: item.quantity || 1,
                unit_cost: item.unit_cost || 0,
                discount: item.discount || 0,
                tax_percent: item.tax_percent || 0,
              }))
            );
          } else {
            setItems([blankItem]);
          }

          if (purchase.payments && purchase.payments.length > 0) {
            setPayments(
              purchase.payments.map((pay) => ({
                payment_date: pay.payment_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
                amount: pay.amount || 0,
                method: pay.method || "cash",
                reference_no: pay.reference_no || "",
                currency: pay.currency || "BDT",
                exchange_rate: pay.exchange_rate || 1,
                note: pay.note || "",
              }))
            );
          } else {
            setPayments([blankPay]);
          }
        } else {
          setMsg("Purchase not found");
        }
      } catch (err) {
        console.error(err);
        setMsg("Failed to load purchase data");
      }
    })();
  }, [id]);

  // Item helpers
  const updateItem = (idx, key, val) =>
    setItems((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: val } : row)));
  const addItem = () => setItems((prev) => [...prev, blankItem]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
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

  // Payments helpers
  const updatePayment = (idx, key, val) =>
    setPayments((prev) => prev.map((p, i) => (i === idx ? { ...p, [key]: val } : p)));
  const addPayment = () => setPayments((p) => [...p, blankPay]);
  const removePayment = (idx) => setPayments((p) => p.filter((_, i) => i !== idx));

  // Order-level calculations
  const totalItems = items.reduce((sum, it) => sum + subTot(it), 0);
  const shippingCost = rd(header.shipping);
  const orderTaxPct = Number(header.order_tax) || 0;
  const orderTaxAmt = rd((orderTaxPct / 100) * totalItems);
  const grandTotal = rd(totalItems + shippingCost + orderTaxAmt);
  const paidAmount = rd(header.paid_amount);
  const dueAmount = rd(grandTotal - paidAmount);

  // Submit handler (PUT for update)
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
      const res = await fetch(`${API}/purchases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setMsg("Purchase updated successfully!");
        setTimeout(() => nav("/purchase/listpurchase"), 1200);
      } else {
        setMsg(body.message || "Failed to update purchase");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>Edit Purchase</h2>
          <Breadcrumbs separator="›">
            <MUILink component={Link} to="/" underline="hover">
              <HomeOutlinedIcon sx={{ mr: 0.5 }} />
              Dashboard
            </MUILink>
            <MUILink component={Link} to="/purchase/listpurchase" underline="hover">
              Purchases
            </MUILink>
            <Typography color="text.primary">Edit Purchase</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <hr />

      <form onSubmit={handleSubmit}>
        {/* Purchase Details */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="mb-3" style={{ color: "#034158" }}>
              Purchase Details
            </h4>

            <div className="row3 g-2">
              <div className="col-md-4">
                <label>Supplier *</label>
                <select
                  className="form-control"
                  value={header.supplier_id}
                  onChange={(e) => setHeader({ ...header, supplier_id: e.target.value })}
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

              <div className="col-md-4">
                <label>Warehouse *</label>
                <select
                  className="form-control"
                  value={header.warehouse_id}
                  onChange={(e) => setHeader({ ...header, warehouse_id: e.target.value })}
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

              <div className="col-md-4">
                <label>Purchase Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={header.purchase_date}
                  onChange={(e) => setHeader({ ...header, purchase_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="row3 g-2 mt-2">
              {["reference", "purchase_no", "invoice_number"].map((field, i) => (
                <div className="col-md-4" key={field}>
                  <label>{["Reference *", "Purchase No *", "Invoice Number *"][i]}</label>
                  <input
                    className="form-control"
                    value={header[field]}
                    onChange={(e) => setHeader({ ...header, [field]: e.target.value })}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="row3 mt-2">
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

        {/* Items */}
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
                      <td>
                        <select
                          className="form-select"
                          value={it.product_id}
                          onChange={(e) => updateItem(idx, "product_id", e.target.value)}
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
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={it.unit_cost}
                          onChange={(e) => updateItem(idx, "unit_cost", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
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
                          className="form-control"
                          value={it.tax_percent}
                          onChange={(e) => updateItem(idx, "tax_percent", e.target.value)}
                        />
                      </td>
                      <td>
                        {rd(
                          ((Number(it.tax_percent) || 0) / 100) *
                            (rd(it.unit_cost) * rd(it.quantity) - discAmt(it))
                        )}
                      </td>
                      <td>{subTot(it)}</td>
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

            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addItem}>
              <AddCircleOutlineIcon /> Add Item
            </button>

            <div className="row g-2 mt-3">
              <div className="col-md-3">
                <label>Shipping Cost</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={header.shipping}
                  onChange={(e) => setHeader({ ...header, shipping: e.target.value })}
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
                  onChange={(e) => setHeader({ ...header, order_tax: e.target.value })}
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
                  onChange={(e) => setHeader({ ...header, paid_amount: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Due Amount</label>
                <input type="number" disabled value={dueAmount} className="form-control" />
              </div>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="mb-3" style={{ color: "#034158" }}>
              Payments
            </h4>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Payment Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference No</th>
                    <th>Currency</th>
                    <th>Exchange Rate</th>
                    <th>Note</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={pay.payment_date}
                          onChange={(e) => updatePayment(i, "payment_date", e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={pay.amount}
                          onChange={(e) => updatePayment(i, "amount", e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={pay.method}
                          onChange={(e) => updatePayment(i, "method", e.target.value)}
                        >
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="bank">Bank</option>
                          <option value="mobile">Mobile</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={pay.reference_no}
                          onChange={(e) => updatePayment(i, "reference_no", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={pay.currency}
                          onChange={(e) => updatePayment(i, "currency", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={pay.exchange_rate}
                          onChange={(e) => updatePayment(i, "exchange_rate", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={pay.note}
                          onChange={(e) => updatePayment(i, "note", e.target.value)}
                        />
                      </td>
                      <td className="text-center">
                        {payments.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removePayment(i)}
                          >
                            <ClearOutlinedIcon fontSize="small" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addPayment}>
              <AddCircleOutlineIcon /> Add Payment
            </button>
          </div>
        </div>

        {msg && <p className="text-danger fw-bold">{msg}</p>}

     



            <div className="card">
          <div className="card-footer d-flex justify-content-between">
             <button
            type="submit"
            className="btn2 d-flex align-items-center gap-2"
            style={{ fontWeight: "bold" }}
          >
            <SaveOutlinedIcon /> Update 
          </button>
            <Link to="/purchase/listpurchase" className="btn3 btn-icon">
              <ClearOutlinedIcon /> Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
