import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllProductsPage from "./pages/allProducts";
import ChildrenPage from "./pages/ChildrenPage";
import WomenCategory from "./pages/WomenPage";
import MenCategory from "./pages/MenPage";
import ProductGrid from './components/ui/ProductGrid';
import ProductDetails from './pages/productDetails';
import ProductDetailContent from './components/ui/ProductDetailContent';
import CustomerInfoPage from './pages/CustomerInfoPage';


// Admin
import AdminLogin from './pages/adminPages/AdminLogin';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import ManageProducts from './pages/adminPages/ManageProducts';
import ManageOrders from './pages/adminPages/ManageOrders';
import CreateProduct from './pages/adminPages/CreateProduct';
import EditProduct from './pages/adminPages/EditProduct';
import ProductDetail from './pages/adminPages/ProductDetail';
import CustomerSummary from './pages/adminPages/CustomerSummary';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* customer */}
        <Route path="/" element={<Home />} />
        <Route path="/AllProducts" element={<AllProductsPage />} />
        <Route path="/WomenPage" element={<WomenCategory />} />
        <Route path="/MenPage" element={<MenCategory />} />
        <Route path="/ChildrenPage" element={<ChildrenPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/customer-info" element={<CustomerInfoPage />} />


        {/* admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/products/create" element={<CreateProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/admin/customers-summary" element={<CustomerSummary />} />
      </Routes>
    </BrowserRouter>
  );
}
