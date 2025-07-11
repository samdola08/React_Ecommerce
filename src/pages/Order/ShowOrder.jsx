import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";   // optional
import "./create.css";   // re‑use the same styles

// const API   = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API   = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
const rd    = (n) => Math.round(Number(n) || 0);
const dt    = (d) => (d ? new Date(d).toLocaleDateString() : "—");

export default function ShowOrder() {
  const { id } = useParams();

  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  /* ───────────────── fetch order ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/orders/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
        setOrder(json.data || json);      // adjust to your API
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ───────────────── derived totals ───────────────── */
  const itemsTotal = order?.items?.reduce(
    (s, it) => s + rd(it.subtotal || it.unit_price * it.quantity),
    0
  ) ?? 0;

  const grandTotal = rd(
    itemsTotal + rd(order?.vat_amount) - rd(order?.discount_amount)
  );
  const paidAmount = rd(order?.paid_amount);
  const dueAmount  = rd(grandTotal - paidAmount);

  /* ───────────────── render ───────────────── */
  if (loading) return <div className="alert alert-info">Loading…</div>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      {/* ── header / breadcrumbs ───────────────────────── */}
      <div className="card">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>
            Show Order #{order.id}
          </h2>

          <Breadcrumbs separator="›">
            <MUILink component={Link} to="/" underline="hover">
              <HomeOutlinedIcon sx={{ mr: 0.5 }} />
              Dashboard
            </MUILink>
            <MUILink component={Link} to="/order/listorder" underline="hover">
              Orders
            </MUILink>
            <Typography color="text.primary">Show&nbsp;Order</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <hr />

      {/* ── Order summary ─────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 style={{ color: "#034158" }} className="mb-3">
            Order Details
          </h4>

          <div className="row3 g-2">
            <div className="col-md-4">
              <label>Customer</label>
              <input
                className="form-control"
                readOnly
                value={order.customer?.name || order.customer_name || "N/A"}
              />
            </div>

            <div className="col-md-4">
              <label>Order Date</label>
              <input className="form-control" readOnly value={dt(order.order_date)} />
            </div>

            <div className="col-md-4">
              <label>Delivery Date</label>
              <input
                className="form-control"
                readOnly
                value={dt(order.delivery_date)}
              />
            </div>
          </div>

          <div className="row3 g-2 mt-2">
            <div className="col-md-6">
              <label>Shipping Address</label>
              <textarea
                className="form-control"
                rows="2"
                readOnly
                value={order.shipping_address || ""}
              />
            </div>
            <div className="col-md-6">
              <label>Note</label>
              <textarea
                className="form-control"
                rows="2"
                readOnly
                value={order.note || ""}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Items table ───────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 style={{ color: "#034158" }} className="mb-3">
            Items
          </h4>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th className="text-end">Qty</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-end">Discount</th>
                  <th className="text-end">Tax</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.product?.name || it.product_name || `#${it.product_id}`}</td>
                    <td className="text-end">{it.quantity}</td>
                    <td className="text-end">{rd(it.unit_price)}</td>
                    <td className="text-end">
                      {it.discount ? `${it.discount}%` : "—"}
                    </td>
                    <td className="text-end">{it.tax ? `${it.tax}%` : "—"}</td>
                    <td className="text-end">{rd(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="5" className="text-end">
                    Items Total
                  </th>
                  <th className="text-end">{itemsTotal}</th>
                </tr>
                <tr>
                  <th colSpan="5" className="text-end">
                    Order Discount
                  </th>
                  <th className="text-end">‑{rd(order.discount_amount)}</th>
                </tr>
                <tr>
                  <th colSpan="5" className="text-end">
                    VAT
                  </th>
                  <th className="text-end">{rd(order.vat_amount)}</th>
                </tr>
                <tr className="table-light fw-bold">
                  <th colSpan="5" className="text-end">
                    Grand Total
                  </th>
                  <th className="text-end">{grandTotal}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* ── Payments ──────────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 style={{ color: "#034158" }} className="mb-3">
            Payment Details
          </h4>

          {order.payments?.length ? (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th className="text-end">Amount</th>
                    <th>Method</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {order.payments.map((p) => (
                    <tr key={p.id}>
                      <td>{dt(p.payment_date)}</td>
                      <td className="text-end">{rd(p.amount)}</td>
                      <td>{p.method}</td>
                      <td>{p.note}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-light fw-bold">
                    <th>Total Paid</th>
                    <th className="text-end">{paidAmount}</th>
                    <th colSpan="2" className="text-end">
                      Due&nbsp;:&nbsp;{dueAmount}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">No payments recorded.</div>
          )}
        </div>
      </div>

      {/* ── Footer actions ────────────────────────────── */}
      <div className="card">
        <div className="card-footer d-flex justify-content-between">
          <Link to="/order/listorder" className="btn btn-outline-secondary">
            Back to list
          </Link>

          {/* optional download/print button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            <PictureAsPdfIcon sx={{ mr: 0.5 }} /> Print / PDF
          </button>
        </div>
      </div>
    </>
  );
}
