import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

/* ============================================================== 
   Professional printable invoice that shows *full* supplier info
   ============================================================== */
const InvoicePurchase = () => {
  const API =
    // "http://localhost/ecommerce_app/laravel_backend/public/api";
    "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";
  const { id: purchaseId } = useParams();

  const [purchase, setPurchase] = useState(null);
  const [msg, setMsg] = useState("");
  const printRef = useRef();

  /* ------------------------------------------------------------
     Fetch purchase by ID once the component mounts / ID changes
  -------------------------------------------------------------*/
  useEffect(() => {
    if (!purchaseId) return;

    (async () => {
      try {
        const res = await fetch(`${API}/purchases/${purchaseId}`);
        const data = await res.json();
        if (res.ok && data.purchase) setPurchase(data.purchase);
        else setMsg("Failed to load purchase data");
      } catch (err) {
        console.error(err);
        setMsg("Server error");
      }
    })();
  }, [purchaseId, API]);

  /* ------------------------------------------------------------
     Loading / error state
  -------------------------------------------------------------*/
  if (!purchase) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        {msg || "Loading invoice..."}
      </div>
    );
  }

  /* ------------------------------------------------------------
     Normalise supplier fields (API sometimes sends flat columns)
  -------------------------------------------------------------*/
  const sup = {
    ...(purchase.supplier || {}),
    name: purchase.supplier_name ?? purchase.supplier?.name,
    company_name:
      purchase.supplier_company_name ?? purchase.supplier?.company_name,
    email: purchase.supplier_email ?? purchase.supplier?.email,
    phone: purchase.supplier_phone ?? purchase.supplier?.phone,
    address: purchase.supplier_address ?? purchase.supplier?.address,
    city: purchase.supplier_city ?? purchase.supplier?.city,
    state: purchase.supplier_state ?? purchase.supplier?.state,
    country: purchase.supplier_country ?? purchase.supplier?.country,
    postal_code:
      purchase.supplier_postal_code ?? purchase.supplier?.postal_code,
    tax_id: purchase.supplier_vat_no ?? purchase.supplier?.vat_no,
  };

  /* ------------------------------------------------------------
     Helpers — rounding, per‑item / per‑invoice calculations
  -------------------------------------------------------------*/
  const customRound = (n) => {
    const decimal = n - Math.floor(n);
    return decimal >= 0.5 ? Math.ceil(n) : Math.floor(n);
  };

  const calcDiscount = (it) =>
    ((+it.discount || 0) / 100) * +it.quantity * +it.unit_cost;
  const calcSub = (it) => {
    const afterDisc = +it.quantity * +it.unit_cost - calcDiscount(it);
    const tax = ((+it.tax_percent || 0) / 100) * afterDisc;
    return afterDisc + tax;
  };

  const items = purchase.items || [];
  const subtotal = items.reduce((s, i) => s + calcSub(i), 0);
  const shipping = +purchase.shipping || 0;
  const taxPct = +purchase.order_tax || 0;
  const taxAmt = (taxPct / 100) * subtotal;
  const grandTotal = subtotal + shipping + taxAmt;
  const paid = +purchase.paid_amount || 0;
  const due = grandTotal - paid;

  /* ------------------------------------------------------------
     All inline styles — de‑duplicated (NO duplicate keys!)
  -------------------------------------------------------------*/
  const styles = {
    /* layout */
    container: {
      maxWidth: 900,
      margin: "40px auto",
      padding: 30,
      background: "#fff",
      fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans‑serif",
      color: "#333",
      borderRadius: 6,
      boxShadow: "0 0 12px rgba(0,0,0,.15)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #2c3e50",
      paddingBottom: 15,
      marginBottom: 25,
    },
    logo: { height: 70 },

    /* sections */
    section: { marginBottom: 30 },
    sectionTitle: {
      fontWeight: 700,
      fontSize: 18,
      marginBottom: 12,
      color: "#2c3e50",
      borderBottom: "1px solid #ddd",
      paddingBottom: 5,
    },

    /* grid lines */
    gridRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 4, // tighter spacing
    },
    label: { fontWeight: 600, color: "#555" },
    value: { color: "#222" },

    /* items table */
    table: { width: "100%", borderCollapse: "collapse", marginBottom: 20 },
    th: {
      background: "#2c3e50",
      color: "#fff",
      padding: "12px 15px",
      fontWeight: 700,
      fontSize: 14,
      textAlign: "left",
      borderBottom: "2px solid #1a2733",
    },
    td: {
      padding: "10px 15px",
      borderBottom: "1px solid #ddd",
      fontSize: 14,
      color: "#444",
    },
    rowStriped: { background: "#f9f9f9" },

    /* totals */
    totalsBox: { maxWidth: 350, marginLeft: "auto" },
    totalsRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      fontSize: 15,
      borderTop: "1px solid #ddd",
    },
    totalsRowBold: {
      fontWeight: 700,
      fontSize: 16,
      borderTop: "2px solid #2c3e50",
      marginTop: 10,
      paddingTop: 12,
    },
    paid: { color: "#27ae60" },
    due: { color: due > 0 ? "#c0392b" : "#2c3e50", fontWeight: 700 },

    /* payment details */
    paymentTable: { width: "100%", borderCollapse: "collapse", marginTop: 20 },
    paymentTh: {
      background: "#34495e",
      color: "#fff",
      padding: "10px 12px",
      fontWeight: "bold",
      textAlign: "left",
    },
    paymentTd: { padding: "8px 12px", borderBottom: "1px solid #ccc" },

    /* misc */
    btn: {
      padding: "10px 20px",
      background: "#2c3e50",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      fontWeight: 600,
      marginBottom: 20,
      cursor: "pointer",
    },
    footer: {
      textAlign: "center",
      marginTop: 40,
      fontStyle: "italic",
      color: "#666",
      fontSize: 13,
    },
  };

  /* ------------------------------------------------------------
     Render
  -------------------------------------------------------------*/
  return (
    <>
      {/* Print‑specific overrides */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 6mm; }

          body * { visibility: hidden; }
          #invoice-print-area, #invoice-print-area * { visibility: visible; }

          #invoice-print-area {
            position: absolute;
            inset: 0;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: translateY(-4mm) scale(0.90);
            transform-origin: top left;
            width: calc(100% / 0.90);
          }

          table, tr, td, th, thead, tbody { page-break-inside: avoid; }
          .no-print { display: none !important; }
          .no-break { break-inside: avoid; display: block; margin-top: 0 !important; }
        }`}</style>

      <div id="invoice-print-area" style={styles.container} ref={printRef}>
        {/* ---- Print button (hidden when printing) ---- */}
        <button
         className="btn btn-outline-secondary"
          style={styles.btn}
          onClick={() => window.print()}
        >
          <PictureAsPdfIcon/> &nbsp; Print
        </button>

        {/* ---- Header ---- */}
        <header style={styles.header}>
          <img
            src="/assets/images/logos/cart.png"
            alt="logo"
            style={styles.logo}
          />
          <div style={{ textAlign: "left", color: "#666", fontSize: 14 }}>
            <h5>DeshMart</h5>
            <div>125/A, Dhaka‑1211</div>
            <div>Email: desh@mart.com</div>
            <div>Phone: +880*******</div>
          </div>
        </header>

        {/* Supplier & Purchase Info */}
        <section style={styles.section}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 30,
            }}
          >
            <div style={{ flex: "1 1 300px" }}>
              <h3 style={styles.sectionTitle}>Supplier Details</h3>
              {sup.company_name && (
                <div style={styles.gridRow}>
                  <span style={styles.label}>Company:</span>
                  <span style={styles.value}>{sup.company_name}</span>
                </div>
              )}
              {sup.name && (
                <div style={styles.gridRow}>
                  <span style={styles.label}>Contact:</span>
                  <span style={styles.value}>{sup.name}</span>
                </div>
              )}
              {sup.email && (
                <div style={styles.gridRow}>
                  <span style={styles.label}>Email:</span>
                  <span style={styles.value}>{sup.email}</span>
                </div>
              )}
              {sup.phone && (
                <div style={styles.gridRow}>
                  <span style={styles.label}>Phone:</span>
                  <span style={styles.value}>{sup.phone}</span>
                </div>
              )}
              {(sup.address || sup.city || sup.state || sup.country) && (
                <div style={styles.gridRow}>
                  <span style={styles.label}>Address:</span>
                  <span style={styles.value}>
                    {[
                      sup.address,
                      sup.city,
                      sup.state,
                      sup.country,
                      sup.postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              {sup.tax_id && (
                <div style={styles.gridRow}>
                  <span style={styles.label}>VAT / Tax ID:</span>
                  <span style={styles.value}>{sup.tax_id}</span>
                </div>
              )}
            </div>

            <div style={{ flex: "1 1 300px" }}>
              <h3 style={styles.sectionTitle}>Purchase Details</h3>
              {[
                ["Purchase No", purchase.purchase_no],
                ["Invoice No", purchase.invoice_number],
                ["Date", purchase.purchase_date?.slice(0, 10)],
                ["Reference", purchase.reference],
                [
                  "Warehouse",
                  purchase.warehouse_name ||
                    purchase.warehouse?.name ||
                    purchase.warehouse_id ||
                    "N/A",
                ],
              ].map(([lbl, val]) => (
                <div style={styles.gridRow} key={lbl}>
                  <span style={styles.label}>{lbl}:</span>
                  <span style={styles.value}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Items Table */}
        <section>
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  "Product",
                  "Qty",
                  "Unit Cost",
                  "Discount %",
                  "Discount Amt",
                  "Tax %",
                  "Tax Amt",
                  "Subtotal",
                ].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ ...styles.td, textAlign: "center" }}>
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((it, i) => (
                  <tr key={i} style={i % 2 ? styles.rowStriped : undefined}>
                    <td style={styles.td}>
                      {it.product_name ||
                        it.name ||
                        it.product?.name ||
                        `#${it.product_id}`}
                    </td>
                    <td style={styles.td}>{customRound(it.quantity)}</td>
                    <td style={styles.td}>{customRound(+it.unit_cost)}</td>
                    <td style={styles.td}>{customRound(it.discount)}</td>
                    <td style={styles.td}>{customRound(calcDiscount(it))}</td>
                    <td style={styles.td}>{customRound(it.tax_percent)}</td>
                    <td style={styles.td}>
                      {customRound(
                        ((+it.tax_percent || 0) / 100) *
                          ((+it.unit_cost || 0) * (+it.quantity || 0) -
                            calcDiscount(it))
                      )}
                    </td>
                    <td style={styles.td}>{customRound(calcSub(it))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Totals */}
        <section style={styles.totalsBox}>
          {[
            ["Subtotal", subtotal],
            ["Shipping Cost", shipping],
            [`Order Tax (${taxPct}%)`, taxAmt],
          ].map(([lbl, val]) => (
            <div style={styles.totalsRow} key={lbl}>
              <span>{lbl}:</span>
              <span>{customRound(val)} ৳</span>
            </div>
          ))}
          <div style={{ ...styles.totalsRow, ...styles.totalsRowBold }}>
            <span>Grand Total:</span>
            <span>{customRound(grandTotal)} ৳</span>
          </div>
          <div style={{ ...styles.totalsRow, ...styles.paid }}>
            <span>Paid Amount:</span>
            <span>{customRound(paid)} ৳</span>
          </div>
          <div style={{ ...styles.totalsRow, ...styles.due }}>
            <span>Due Amount:</span>
            <span>{customRound(due)} ৳</span>
          </div>
        </section>

        {/* Payment Table */}
        {purchase.payments && purchase.payments.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h3 style={styles.sectionTitle}>Payment Details</h3>
            <table style={styles.paymentTable}>
              <thead>
                <tr>
                  <th style={styles.paymentTh}>Payment Date</th>
                  <th style={styles.paymentTh}>Amount</th>
                  <th style={styles.paymentTh}>Method</th>
                  <th style={styles.paymentTh}>Note</th>
                </tr>
              </thead>
              <tbody>
                {purchase.payments.map((p, i) => (
                  <tr key={i} style={i % 2 ? styles.rowStriped : undefined}>
                    <td style={styles.paymentTd}>
                      {p.payment_date?.slice(0, 10) || "N/A"}
                    </td>
                    <td style={styles.paymentTd}>{customRound(+p.amount)} ৳</td>
                    <td style={styles.paymentTd}>{p.method || "N/A"}</td>
                    <td style={styles.paymentTd}>{p.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {/*  NOTES + FOOTER  */}
        <div className="no-break">
          {purchase.note && (
            <section style={{ marginTop: 40 }}>
              <h4
                style={{
                  borderBottom: "1px solid #ddd",
                  paddingBottom: 6,
                  marginBottom: 10,
                }}
              >
                Notes
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "#555" }}>
                {purchase.note}
              </p>
            </section>
          )}

          <footer style={styles.footer}>
            Thank you for your business! If you have any questions, please
            contact us.
          </footer>
        </div>
      </div>
    </>
  );
};

export default InvoicePurchase;
