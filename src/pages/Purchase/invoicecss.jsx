// ইনভয়েস‑স্টাইল.js
const invoiceStyles = (due = 0) => ({
  /* layout */
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 30,
    background: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
});

export default invoiceStyles;
