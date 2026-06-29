import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Upload,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductModal from "./ProductModal";
//import "./ProductTable.css";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);

  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/product/all_Products");
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("adminToken");

      await fetch(`http://localhost:8000/product/delete_Product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* ================= HEADER CARD ================= */}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Product Management
            </h1>

            <p className="text-gray-500 mt-2">
              Create, edit and organize your product catalogue.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
              <Upload size={17} />
              Import
            </button>

            <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
              <Download size={17} />
              Export
            </button>

            <button
              onClick={() => navigate("/admin/products/create")}
              style={{ backgroundColor: "#FFC0CB" }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black hover:opacity-90 transition"
            >
              <Plus size={18} />
              Create Product
            </button>
          </div>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FFC0CB] focus:outline-none"
            />
          </div>

          <select className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FFC0CB] focus:bg-white outline-none">
            <option>All Categories</option>
          </select>

          <select className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FFC0CB] focus:bg-white outline-none">
            <option>All Products</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-left text-sm uppercase tracking-wide text-gray-500">
              <th className="px-6 py-4"></th>

              <th className="px-6 py-4">Name</th>

              <th className="px-6 py-4">Category</th>

              <th className="px-6 py-4">Status</th>

              <th className="px-6 py-4">Stock</th>

              <th className="px-6 py-4">Price</th>

              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {" "}
            {paginated.length > 0 ? (
              paginated.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <img
                      src={
                        product.images?.[0] || "https://via.placeholder.com/60"
                      }
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                    />
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {product.category}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td
                    className={`px-6 py-4 font-semibold ${
                      product.stock <= 5 ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {product.stock}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Rs. {Number(product.price).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-4">
                      {/* Edit */}
                      <Edit2
                        size={18}
                        className="text-sky-600 cursor-pointer hover:text-sky-800 transition"
                        onClick={() =>
                          navigate(`/admin/products/edit/${product._id}`)
                        }
                      />

                      {/* Delete */}
                      <Trash2
                        size={18}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition"
                        onClick={() => handleDelete(product._id)}
                      />

                      {/* Preview */}
                      <Eye
                        size={18}
                        className="text-gray-600 cursor-pointer hover:text-black transition"
                        onClick={() => setModalProduct(product)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-11 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-11 h-11 rounded-xl font-semibold transition ${
              currentPage === i + 1
                ? "text-black"
                : "border border-gray-200 bg-white hover:bg-gray-50"
            }`}
            style={currentPage === i + 1 ? { backgroundColor: "#FFC0CB" } : {}}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="w-11 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ================= MODAL ================= */}

      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />
    </div>
  );
};

export default ProductTable;
