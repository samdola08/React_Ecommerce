import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";

// const BASE_URL = "http://localhost/ecommerce_app/laravel_backend/public/api";
const BASE_URL = "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/api";

const IMAGE_BASE_URL =
  // "http://localhost/ecommerce_app/laravel_backend/public/img/Product/";
  "http://dola.intelsofts.com/ecommerce_app/laravel_backend/public/img/Product/";

const ListStock = () => {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState({}); // Map: id → {name, image}
  const [warehouses, setWarehouses] = useState({}); // Map: id → warehouse name

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const stocksRes = await fetch(`${BASE_URL}/stocks`);
        const productsRes = await fetch(`${BASE_URL}/products`);
        const warehousesRes = await fetch(`${BASE_URL}/warehouses`);

        let stocksData = await stocksRes.json();
        let productsData = await productsRes.json();
        let warehousesData = await warehousesRes.json();

        stocksData = stocksData.stocks || stocksData;
        productsData = productsData.products || productsData;
        warehousesData = warehousesData.warehouses || warehousesData;

        if (!Array.isArray(stocksData)) stocksData = [];
        if (!Array.isArray(productsData)) productsData = [];
        if (!Array.isArray(warehousesData)) warehousesData = [];

        // Build product map: id → {name, image}
        const productsMap = {};
        productsData.forEach((p) => {
          productsMap[p.id] = {
            name: p.name || p.product_name || `Product #${p.id}`,
            image: p.image || null,
          };
        });

        // Build warehouse map: id → name
        const warehousesMap = {};
        warehousesData.forEach((w) => {
          warehousesMap[w.id] =
            w.name || w.warehouse_name || `Warehouse #${w.id}`;
        });

        setProducts(productsMap);
        setWarehouses(warehousesMap);

        // Normalize stocks
        const normalizedStocks = stocksData.map((s) => ({
          ...s,
          note: s.note ?? "",
          type: s.type ?? "",
        }));

        setStocks(normalizedStocks);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        `Are you sure you want to delete stock record ID "${id}"?`
      )
    )
      return;

    try {
      const res = await fetch(`${BASE_URL}/stocks/${id}`, { method: "DELETE" });
      if (res.ok) {
        const updated = stocks.filter((s) => s.id !== id);
        setStocks(updated);

        const newTotalPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
      } else {
        alert("Failed to delete stock record");
      }
    } catch (error) {
      console.error("Error deleting stock record:", error);
      alert("Error deleting stock record");
    }
  };

  // Filter stocks by search term
  const filteredStocks = stocks.filter((s) => {
    const product = products[s.product_id] || { name: "" };
    const warehouseName = warehouses[s.warehouse_id] || "";

    const term = searchTerm.toLowerCase();

    return (
      s.type?.toLowerCase().includes(term) ||
      s.note.toLowerCase().includes(term) ||
      (s.reference_id?.toString() ?? "").includes(term) ||
      (s.product_id?.toString() ?? "").includes(term) ||
      (s.warehouse_id?.toString() ?? "").includes(term) ||
      product.name.toLowerCase().includes(term) ||
      warehouseName.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStocks = filteredStocks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 style={{ fontWeight: "bolder", color: "#034158" }}>
          List Of Stocks
        </h2>
        {/* <Link to="/stock/createstock" className="btn2 btn-primary">
          Add Stock
        </Link> */}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by type, note, product, warehouse, reference ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <hr />

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-table">
              <thead className="table-light d-md-table-header-group">
                <tr>
                  <th>ID</th>
                  <th>Image & Product</th>
                  <th>Warehouse</th>
                  <th>Type</th>
                  <th>Reference ID</th>
                  <th>Quantity In</th>
                  <th>Quantity Out</th>
                  <th>Total Stock</th>
                  <th>Stock Date</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {currentStocks.map((stock) => {
                  const product = products[stock.product_id] || {
                    name: stock.product_id,
                    image: null,
                  };
                  return (
                    <tr key={stock.id}>
                      <td>{stock.id}</td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {product.image ? (
                          <img
                            src={`${IMAGE_BASE_URL}${product.image}`}
                            alt={product.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: "#ddd",
                              borderRadius: "4px",
                            }}
                          />
                        )}
                        <span>{product.name}</span>
                      </td>
                      <td>{warehouses[stock.warehouse_id]}</td>
                      <td>
                        <span
                          className={`badge ${
                            stock.type === "purchase"
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        >
                          {stock.type}
                        </span>
                      </td>
                      <td>{stock.reference_id}</td>
                      <td>{stock.quantity_in}</td>
                      <td>{stock.quantity_out}</td>
                      <td>{stock.total_stock}</td>
                      <td>{new Date(stock.stock_date).toLocaleDateString()}</td>
                      <td>{stock.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ListStock;
