import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layout/MainLayout";

import ListBrand from "./pages/Inventory/Brand/ListBrand.jsx";
import CreateBrand from "./pages/Inventory/Brand/CreateBrand";
import EditBrand from "./pages/Inventory/Brand/EditBrand";
import ShowBrand from "./pages/Inventory/Brand/ShowBrand";

import ListCategory from "./pages/Inventory/Category/ListCategory.jsx";
import CreateCategory from "./pages/Inventory/Category/CreateCategory.jsx";
import EditCategory from "./pages/Inventory/Category/EditCategory.jsx";
import ShowCategory from "./pages/Inventory/Category/ShowCategory.jsx";

import ListSupplier from "./pages/Supplier/ListSupplier.jsx";
import CreateSupplier from "./pages/Supplier/CreateSupplier.jsx";
import EditSupplier from "./pages/Supplier/EditSupplier.jsx";
import ShowSupplier from "./pages/Supplier/ShowSupplier.jsx";

import ListWarehouse from "./pages/Warehouse/ListWareHouse.jsx";
import CreateWarehouse from "./pages/Warehouse/CreateWareHouse.jsx";
import EditWarehouse from "./pages/Warehouse/EditWareHouse.jsx";
import ShowWarehouse from "./pages/Warehouse/ShowWareHouse.jsx";

import ListProduct from "./pages/Inventory/Product/ListProduct.jsx";
import CreateProduct from "./pages/Inventory/Product/CreateProduct.jsx";
import EditProduct from "./pages/Inventory/Product/EditProduct.jsx";
import ShowProduct from "./pages/Inventory/Product/ShowProduct.jsx";

import ListPurchase from "./pages/Purchase/ListPurchase.jsx";
import CreatePurchase from "./pages/Purchase/CreatePurchase.jsx";
import EditPurchase from "./pages/Purchase/EditPurchase.jsx";
import ShowPurchase from "./pages/Purchase/ShowPurchase.jsx";
import InvoicePurchase from "./pages/Purchase/InvoicePurchase.jsx";

import ListCustomer from "./pages/Customer/ListCustomer.jsx";
import CreateCustomer from "./pages/Customer/CreateCustomer.jsx";
import EditCustomer from "./pages/Customer/EditCustomer.jsx";
import ShowCustomer from "./pages/Customer/ShowCustomer.jsx";

import ListOrder from "./pages/Order/ListOrder.jsx";
import CreateOrder from "./pages/Order/CreateOrder.jsx";
import EditOrder from "./pages/Order/EditOrder.jsx";
import ShowOrder from "./pages/Order/ShowOrder.jsx";
import OrderInvoice from "./pages/Order/OrderInvoice.jsx";

import ListStock from "./pages/Stock/ListStock.jsx"
import ShowStock from "./pages/Stock/ShowStock.jsx";

import ListDelivery from "./pages/Delivery/ListDelivery.jsx"
import CreateDelivery from "./pages/Delivery/CreateDelivery.jsx";



function App() {
  return (
    //  <BrowserRouter basename="/ecommerce_app/ecommerce-backend">
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

{/* Brand */}
          <Route path="inventory/brand/listbrand" element ={<ListBrand/>}   />
          <Route path="inventory/brand/createbrand" element ={<CreateBrand/>}   />
          <Route path="inventory/brand/editbrand/:id" element={<EditBrand />}   />
          <Route path="inventory/brand/showbrand/:id" element={<ShowBrand />}   />
{/* Category */}
          <Route path="inventory/category/listcategory" element ={<ListCategory/>}   />
          <Route path="inventory/category/createcategory" element ={<CreateCategory/>}   />
          <Route path="inventory/category/editcategory/:id" element={<EditCategory />} />
          <Route path="inventory/category/showcategory/:id" element={<ShowCategory />} />
{/* Supplier */}
          <Route path="supplier/listsupplier" element ={<ListSupplier/>}   />
          <Route path="supplier/createsupplier" element ={<CreateSupplier/>}   />
          <Route path="supplier/editsupplier/:id" element={<EditSupplier />} />
          <Route path="supplier/showsupplier/:id" element={<ShowSupplier />} />
{/* Warehouse */}
          <Route path="warehouse/listwarehouse" element ={<ListWarehouse/>}   />
          <Route path="warehouse/createwarehouse" element ={<CreateWarehouse/>}   />
          <Route path="warehouse/editwarehouse/:id" element={<EditWarehouse />} />
          <Route path="warehouse/showwarehouse/:id" element={<ShowWarehouse />} />
{/* Product */}
          <Route path="inventory/product/listproduct" element ={<ListProduct/>}   />
          <Route path="inventory/product/createproduct" element ={<CreateProduct/>}   />
          <Route path="inventory/product/editproduct/:id" element={<EditProduct />} />
          <Route path="inventory/product/showproduct/:id" element={<ShowProduct />}   />
{/* Purchase */}
          <Route path="purchase/listpurchase" element ={<ListPurchase/>}   />
          <Route path="purchase/createpurchase" element ={<CreatePurchase/>}   />
          <Route path="purchase/editpurchase/:id" element={<EditPurchase />} />
          <Route path="purchase/showpurchase/:id" element={<ShowPurchase />}   />
          <Route path="purchase/invoicepurchase/:id" element={<InvoicePurchase />}   />
{/* Customer */}
          <Route path="customer/listcustomer" element ={<ListCustomer/>}   />
          <Route path="customer/createcustomer" element ={<CreateCustomer/>}   />
          <Route path="customer/editcustomer/:id" element={<EditCustomer />} />
          <Route path="customer/showcustomer/:id" element={<ShowCustomer />}   />
{/* Order */}
          <Route path="order/listorder" element={<ListOrder/>}  />
          <Route path="order/createorder" element={<CreateOrder/>}  />
          <Route path="order/editorder/:id" element={<EditOrder/>}/>
          <Route path="order/showorder/:id" element={<ShowOrder/>}/>
          <Route path="order/orderinvoice/:id" element={<OrderInvoice/>}/>
{/* Stock */}
          <Route path="stock/liststock" element={<ListStock/>}/>
          <Route path="stock/showstock/:id" element={<ShowStock/>}/>
{/* Delivery */}
          <Route path="delivery/listdelivery" element={<ListDelivery/>}/>
          <Route path="delivery/createdelivery" element={<CreateDelivery/>}/>


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
