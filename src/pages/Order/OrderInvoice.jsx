import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
const rd = (n) => Number(n).toFixed(2);
const dt = (d) => (d ? new Date(d).toLocaleDateString() : "—");

export default function OrderInvoice() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/orders/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
        setOrder(json.data || json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading invoice...</div>;
  if (error) return <div>Error: {error}</div>;

  const itemsTotal =
    order?.items?.reduce(
      (sum, it) => sum + (it.subtotal || it.unit_price * it.quantity),
      0
    ) || 0;

  const grandTotal = Number(
    itemsTotal +
      Number(order.vat_amount || 0) -
      Number(order.discount_amount || 0)
  ).toFixed(2);

  const paidAmount = Number(order.paid_amount || 0).toFixed(2);
  const dueAmount = (grandTotal - paidAmount).toFixed(2);

  return (
    <div
      style={{
        width: 800,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div className="card shadow-sm">
        <div className="card-body p-5">
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <h1>Invoice</h1>
              <p>
                <strong>Order #:</strong> {order.id} <br />
                <strong>Date:</strong> {dt(order.order_date)}
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <h2>DeshMart</h2>
              <p>
                125/A, Dhaka-1211
                <br />
                Phone: +880******
                <br />
                Email: desh@mart.com
              </p>
            </div>
          </header>

          {/* Customer Info */}
          <section style={{ marginBottom: 20 }}>
            <h3>Bill To:</h3>
            <p>
              {order.customer?.name || order.customer_name || "N/A"} <br />
              {order.shipping_address || "No address provided"} <br />
              Phone: {order.customer?.phone || order.phone || "N/A"}
            </p>
          </section>

          {/* Items Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>
                  Product
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Unit Price
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Discount
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Tax
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    {it.product?.name || it.product_name || `#${it.product_id}`}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      textAlign: "right",
                    }}
                  >
                    {it.quantity}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      textAlign: "right",
                    }}
                  >
                    {rd(it.unit_price)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      textAlign: "right",
                    }}
                  >
                    {it.discount ? `${it.discount}%` : "—"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      textAlign: "right",
                    }}
                  >
                    {it.tax ? `${it.tax}%` : "—"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      textAlign: "right",
                    }}
                  >
                    {rd(it.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th
                  colSpan={5}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Items Total:
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  {rd(itemsTotal)}
                </th>
              </tr>
              <tr>
                <th
                  colSpan={5}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  VAT:
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  {rd(order.vat_amount)}
                </th>
              </tr>
              <tr>
                <th
                  colSpan={5}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Discount:
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  -{rd(order.discount_amount)}
                </th>
              </tr>
              <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                <th
                  colSpan={5}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Grand Total:
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  {grandTotal}
                </th>
              </tr>
              <tr>
                <th
                  colSpan={5}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Paid:
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  {paidAmount}
                </th>
              </tr>
              <tr>
                <th
                  colSpan={5}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  Due:
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  {dueAmount}
                </th>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <footer style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            <p>Thank you for your business!</p>
          </footer>

          {/* Back button */}
          {/* footer */}
          <div className="card">
            <div className="card-footer d-flex justify-content-between align-items-center">
              {/* Back  */}
              <Link to="/order/listorder" className="btn3">
                ← Back
              </Link>

              {/* Print / PDF */}
              <button
                type="button" // ← prevents implicit form‑submit
                className="btn2"
                onClick={() => window.print()}
              >
                <PictureAsPdfIcon style={{ verticalAlign: "middle" }} />
                &nbsp;Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
