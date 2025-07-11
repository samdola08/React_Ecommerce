// src/pages/order/EditOrder.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Breadcrumbs, Typography, Link as MUILink } from "@mui/material";
import "./create.css";

/* ─── helpers ─────────────────────────────────────────────────── */
const rd = (n) => Math.round(Number(n) || 0);
const today = () => new Date().toISOString().slice(0, 10);
// const API = "http://localhost/ecommerce_app/laravel_backend/public/api";
const API  = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

/* ─── component ──────────────────────────────────────────────── */
export default function EditOrder() {
  const { id } = useParams();
  const nav   = useNavigate();

  /* lookup lists */
  const [customers, setCustomers] = useState([]);
  const [products,  setProducts]  = useState([]);

  /* order header */
  const [header, setHeader] = useState({
    customer_id:      "",
    customer_name:    "",
    order_date:       today(),
    delivery_date:    today(),
    shipping_address: "",
    note:             "",
    discount_amount:  0,
    vat_amount:       0,
    paid_amount:      "0",
  });

  /* items & payments */
  const blankItem = { product_id:"", quantity:1, unit_price:0, discount:0, tax:0 };
  const blankPay  = { payment_date: today(), amount:0, method:"cash", note:"" };

  const [items,     setItems]     = useState([blankItem]);
  const [payments,  setPayments]  = useState([blankPay]);

  /* messages */
  const [msg, setMsg] = useState("");

  /* ─── calculations ─────────────────────────────────────────── */
  const discAmt = it => rd(((+it.discount||0)/100)*rd(it.unit_price)*rd(it.quantity));
  const taxAmt  = it => rd(((+it.tax||0)/100)*(rd(it.unit_price)*rd(it.quantity)-discAmt(it)));
  const subTot  = it => rd(rd(it.unit_price)*rd(it.quantity)-discAmt(it)+taxAmt(it));

  const itemsTotal = items.reduce((s,it)=>s+subTot(it),0);
  const grandTotal = rd(itemsTotal + rd(header.vat_amount) - rd(header.discount_amount));
  const paidAmount = rd(header.paid_amount);
  const dueAmount  = rd(grandTotal - paidAmount);

  /* ─── fetch lookup lists (once) ─────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch(`${API}/customers`).then(r=>r.json()),
          fetch(`${API}/products`).then(r=>r.json()),
        ]);
        setCustomers(cRes.customers ?? cRes.data ?? cRes ?? []);
        setProducts (pRes.products  ?? pRes.data  ?? pRes ?? []);
      } catch (err) {
        console.error("Failed loading customers/products", err);
      }
    })();
  }, []);

  /* ─── fetch the order by id ─────────────────────────────────── */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res  = await fetch(`${API}/orders/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);

        const o = json.data || json;

        setHeader(h=>({
          ...h,
          customer_id:      String(o.customer_id),
          customer_name:    o.customer?.name || "",
          order_date:       o.order_date?.slice(0,10)     || today(),
          delivery_date:    o.delivery_date?.slice(0,10)  || today(),
          shipping_address: o.shipping_address || "",
          note:             o.note || "",
          discount_amount:  o.discount_amount || 0,
          vat_amount:       o.vat_amount || 0,
          paid_amount:      String(o.paid_amount || 0),
        }));

        setItems(
          o.items?.map(it=>({
            product_id:String(it.product_id),
            quantity:  rd(it.quantity),
            unit_price:rd(it.unit_price),
            discount:  it.discount,
            tax:       it.tax,
          })) ?? [blankItem]
        );

        setPayments(
          o.payments?.map(p=>({
            payment_date:p.payment_date?.slice(0,10),
            amount:      p.amount,
            method:      p.method,
            note:        p.note,
          })) ?? [blankPay]
        );
      } catch (err) {
        console.error("Failed loading order", err);
        setMsg(err.message || "Could not load order data");
      }
    })();
  }, [id]);

  /* ─── handlers ─────────────────────────────────────────────── */
  const updateItem    = (i,k,v)=> setItems(  prev => prev.map((row,idx)=>(idx===i?{...row,[k]:v}:row)));
  const updatePayment = (i,k,v)=> setPayments(prev => prev.map((row,idx)=>(idx===i?{...row,[k]:v}:row)));

  /* submit */
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const payload={
      ...header,
      discount_amount: rd(header.discount_amount),
      vat_amount:      rd(header.vat_amount),
      paid_amount:     paidAmount,
      items: items.map(it=>({
        ...it,
        product_id: Number(it.product_id),
        quantity:   rd(it.quantity),
        unit_price: rd(it.unit_price),
        subtotal:   subTot(it)
      })),
      payments: payments.map(p=>({...p,amount:rd(p.amount)})),
    };

    try{
      const res  = await fetch(`${API}/orders/${id}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(payload),
      });
      const body = await res.json();
      if(res.ok){
        setMsg("Order updated successfully!");
        setTimeout(()=>nav("/order/listorder"),1200);
      }else{
        setMsg(body.message || "Failed to update order");
      }
    }catch(err){
      console.error(err);
      setMsg("Server error");
    }
  };

  /* ─── ui (same as before except product list now works) ─────── */
  return (
    <>
      {/* Header / breadcrumbs */}
      <div className="card">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between">
          <h2 style={{ fontWeight:"bolder", color:"#034158" }}>Edit Order</h2>
          <Breadcrumbs separator="›">
            <MUILink component={Link} to="/" underline="hover">
              <HomeOutlinedIcon sx={{ mr:0.5 }} /> Dashboard
            </MUILink>
            <MUILink component={Link} to="/order/listorder" underline="hover">
              Orders
            </MUILink>
            <Typography color="text.primary">Edit Order</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <hr/>

      <form onSubmit={handleSubmit}>
        {/* --- Order header --- */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 style={{color:"#034158"}} className="mb-3">Order Details</h4>

            <div className="row3 g-2">
              <div className="col-md-4">
                <label>Customer</label>
                <input className="form-control" readOnly value={header.customer_name||"N/A"}/>
              </div>
              <div className="col-md-4">
                <label>Order Date *</label>
                <input type="date" className="form-control"
                  value={header.order_date}
                  onChange={e=>setHeader({...header,order_date:e.target.value})} required/>
              </div>
              <div className="col-md-4">
                <label>Delivery Date *</label>
                <input type="date" className="form-control"
                  value={header.delivery_date}
                  onChange={e=>setHeader({...header,delivery_date:e.target.value})} required/>
              </div>
            </div>

            <div className="row3 g-2 mt-2">
              <div className="col-md-6">
                <label>Shipping Address *</label>
                <input className="form-control" required
                  value={header.shipping_address}
                  onChange={e=>setHeader({...header,shipping_address:e.target.value})}/>
              </div>
              <div className="col-md-6">
                <label>Note</label>
                <input className="form-control"
                  value={header.note}
                  onChange={e=>setHeader({...header,note:e.target.value})}/>
              </div>
            </div>
          </div>
        </div>

        {/* --- Items table --- */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 style={{color:"#034158"}} className="mb-3">Items</h4>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{width:"25%"}}>Product</th>
                    <th style={{width:"7%" }}>Qty</th>
                    <th style={{width:"10%"}}>Unit Price</th>
                    <th style={{width:"10%"}}>Discount %</th>
                    <th style={{width:"11%"}}>Discount Amt</th>
                    <th style={{width:"8%" }}>Tax %</th>
                    <th style={{width:"11%"}}>Tax Amt</th>
                    <th style={{width:"11%"}}>Subtotal</th>
                    <th style={{width:"7%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it,idx)=>(
                    <tr key={idx}>
                      <td>
                        <select className="form-select" required
                          value={it.product_id}
                          onChange={e=>updateItem(idx,"product_id",e.target.value)}>
                          <option value="">-- Select --</option>
                          {products.map(p=>(
                            <option key={p.id} value={String(p.id)}>{p.name}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" min="1" className="form-control"
                        value={it.quantity}
                        onChange={e=>updateItem(idx,"quantity",e.target.value)}/></td>
                      <td><input type="number" min="0" className="form-control"
                        value={it.unit_price}
                        onChange={e=>updateItem(idx,"unit_price",e.target.value)}/></td>
                      <td><input type="number" min="0" max="100" className="form-control"
                        value={it.discount}
                        onChange={e=>updateItem(idx,"discount",e.target.value)}/></td>
                      <td>{discAmt(it)}</td>
                      <td><input type="number" min="0" className="form-control"
                        value={it.tax}
                        onChange={e=>updateItem(idx,"tax",e.target.value)}/></td>
                      <td>{taxAmt(it)}</td>
                      <td>{subTot(it)}</td>
                      <td className="text-center">
                        {items.length>1 && (
                          <button type="button" className="btn btn-sm btn-outline-danger"
                            onClick={()=>setItems(prev=>prev.filter((_,i)=>i!==idx))}>
                            <RemoveCircleOutlineIcon fontSize="small"/>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" className="btn btn-sm btn-outline-primary"
              onClick={()=>setItems(prev=>[...prev,blankItem])}>
              <AddCircleOutlineIcon/> Add Item
            </button>

            {/* totals */}
            <div className="row g-2 mt-3">
              <div className="col-md-3">
                <label>Order Discount (amount)</label>
                <input type="number" min="0" className="form-control"
                  value={header.discount_amount}
                  onChange={e=>setHeader({...header,discount_amount:e.target.value})}/>
              </div>
              <div className="col-md-3">
                <label>Order VAT (amount)</label>
                <input type="number" min="0" className="form-control"
                  value={header.vat_amount}
                  onChange={e=>setHeader({...header,vat_amount:e.target.value})}/>
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Paid Amount</label>
                <input type="number" min="0" max={grandTotal} className="form-control"
                  value={header.paid_amount}
                  onChange={e=>{
                    let v=Number(e.target.value);
                    if(v>grandTotal) v=grandTotal;
                    setHeader({...header,paid_amount:String(v)});
                  }}/>
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Due Amount</label>
                <input readOnly className="form-control" value={dueAmount}/>
              </div>
            </div>

            <div className="text-end mt-3">
              <h5>Total : {grandTotal} ৳</h5>
            </div>
          </div>
        </div>

        {/* --- Payments --- */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 style={{color:"#034158"}} className="mb-3">Payment Details</h4>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr><th>Date</th><th>Amount</th><th>Method</th><th>Note</th><th/></tr>
                </thead>
                <tbody>
                  {payments.map((p,idx)=>(
                    <tr key={idx}>
                      <td><input type="date" className="form-control"
                        value={p.payment_date}
                        onChange={e=>updatePayment(idx,"payment_date",e.target.value)}/></td>
                      <td><input type="number" min="0" className="form-control"
                        value={p.amount}
                        onChange={e=>updatePayment(idx,"amount",e.target.value)}/></td>
                      <td>
                        <select className="form-select"
                          value={p.method}
                          onChange={e=>updatePayment(idx,"method",e.target.value)}>
                          {["cash","bank","cheque","card","mobile","other"].map(m=>(
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </td>
                      <td><input className="form-control"
                        value={p.note}
                        onChange={e=>updatePayment(idx,"note",e.target.value)}/></td>
                      <td className="text-center">
                        {payments.length>1 && (
                          <button type="button" className="btn btn-sm btn-outline-danger"
                            onClick={()=>setPayments(prev=>prev.filter((_,i)=>i!==idx))}>
                            <RemoveCircleOutlineIcon fontSize="small"/>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" className="btn btn-sm btn-outline-primary"
              onClick={()=>setPayments(prev=>[...prev,blankPay])}>
              <AddCircleOutlineIcon/> Add Payment
            </button>
          </div>
        </div>

        {/* --- submit / cancel --- */}
        <div className="card">
          <div className="card-footer d-flex justify-content-between">
            <button type="submit" className="btn2 btn-icon" disabled={paidAmount>grandTotal}>
              <DownloadDoneOutlinedIcon/> Submit
            </button>
            <Link to="/order/listorder" className="btn3 btn-icon">
              <ClearOutlinedIcon/> Cancel
            </Link>
          </div>
        </div>

        {msg && <div className="alert alert-info m-3">{msg}</div>}
      </form>
    </>
  );
}
