import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import "./create.css";

// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
const rd = (n) => Math.round(Number(n) || 0);
const dt = (d) => (d ? new Date(d).toLocaleDateString() : "—");

export default function ShowPurchase() {
  const { id } = useParams();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ─────────── fetch purchase ───────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/purchases/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
        setPurchase(json.purchase || json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ────────── derived totals ───────────── */
  const itemsTotal =
    purchase?.items?.reduce(
      (sum, it) =>
        sum +
        rd(
          (it.unit_cost || it.unit_price) * it.quantity -
            ((it.discount || 0) / 100) * (it.unit_cost || it.unit_price) * it.quantity +
            ((it.tax_percent || it.tax || 0) / 100) *
              ((it.unit_cost || it.unit_price) * it.quantity -
                ((it.discount || 0) / 100) * (it.unit_cost || it.unit_price) * it.quantity)
        ),
      0
    ) || 0;

  const orderTaxPercent = Number(purchase?.order_tax || 0);
  const orderTaxAmount = (orderTaxPercent / 100) * itemsTotal;
  const shippingCost = Number(purchase?.shipping || 0);

  const grandTotal = rd(itemsTotal + orderTaxAmount + shippingCost);
  const paidAmount = rd(purchase?.paid_amount);
  const dueAmount = rd(grandTotal - paidAmount);

  /* ────────── render ───────────── */
  if (loading) return <div className="alert alert-info">Loading…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      {/* Header & Breadcrumbs */}
      <div className="card">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between">
          <h2 style={{ fontWeight: "bolder", color: "#034158" }}>
            Show Purchase #{purchase.id}
          </h2>

          <Breadcrumbs separator="›">
            <MUILink component={Link} to="/" underline="hover">
              <HomeOutlinedIcon sx={{ mr: 0.5 }} />
              Dashboard
            </MUILink>
            <MUILink component={Link} to="/purchase/listpurchase" underline="hover">
              Purchases
            </MUILink>
            <Typography color="text.primary">Show Purchase</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <hr />

      {/* Purchase Summary */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 style={{ color: "#034158" }} className="mb-3">
            Purchase Details
          </h4>

          <div className="row3 g-2">
            <div className="col-md-4">
              <label>Supplier</label>
              <input
                className="form-control"
                readOnly
                value={
                  purchase.supplier?.name ||
                  purchase.supplier_name ||
                  purchase.supplier_id ||
                  "N/A"
                }
              />
            </div>

            <div className="col-md-4">
              <label>Warehouse</label>
              <input
                className="form-control"
                readOnly
                value={
                  purchase.warehouse?.name ||
                  purchase.warehouse_name ||
                  purchase.warehouse_id ||
                  "N/A"
                }
              />
            </div>

            <div className="col-md-4">
              <label>Purchase Date</label>
              <input className="form-control" readOnly value={dt(purchase.purchase_date)} />
            </div>
          </div>

          <div className="row3 g-2 mt-2">
            <div className="col-md-4">
              <label>Reference</label>
              <input className="form-control" readOnly value={purchase.reference || "—"} />
            </div>

            <div className="col-md-4">
              <label>Purchase No</label>
              <input className="form-control" readOnly value={purchase.purchase_no || "—"} />
            </div>

            <div className="col-md-4">
              <label>Invoice No</label>
              <input className="form-control" readOnly value={purchase.invoice_number || "—"} />
            </div>
          </div>

          <div className="row3 g-2 mt-2">
            <div className="col-md-12">
              <label>Note</label>
              <textarea className="form-control" rows="2" readOnly value={purchase.note || ""} />
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
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
                  <th className="text-end">Unit Cost</th>
                  <th className="text-end">Discount</th>
                  <th className="text-end">Tax</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {purchase.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.product?.name || it.product_name || `#${it.product_id}`}</td>
                    <td className="text-end">{it.quantity}</td>
                    <td className="text-end">{rd(it.unit_cost)}</td>
                    <td className="text-end">{it.discount ? `${it.discount}%` : "—"}</td>
                    <td className="text-end">{it.tax_percent ? `${it.tax_percent}%` : "—"}</td>
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
                    Order Tax ({orderTaxPercent}%)
                  </th>
                  <th className="text-end">{rd(orderTaxAmount)}</th>
                </tr>
                <tr>
                  <th colSpan="5" className="text-end">
                    Shipping
                  </th>
                  <th className="text-end">{rd(shippingCost)}</th>
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

      {/* Payment Details */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 style={{ color: "#034158" }} className="mb-3">
            Payment Details
          </h4>

          {purchase.payments?.length ? (
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
                  {purchase.payments.map((p) => (
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
                      Due: {dueAmount}
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

      {/* Footer Actions */}
      <div className="card">
        <div className="card-footer d-flex justify-content-between">
          <Link to="/purchase/listpurchase" className="btn2">
            Back to list
          </Link>

          {/* Optional Print/PDF button */}
          {/* <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <PictureAsPdfIcon sx={{ mr: 0.5 }} /> Print / PDF
          </button> */}
        </div>
      </div>
    </>
  );
}
