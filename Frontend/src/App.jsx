import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Home from "./pages/Home";
import AllProductsPage from "./pages/allProducts";
import ChildrenPage from "./pages/ChildrenPage";
import WomenCategory from "./pages/WomenPage";
import MenCategory from "./pages/MenPage";
import ProductGrid from './components/ui/ProductGrid';
import ProductDetails from './pages/productDetails';
import ProductDetailContent from './components/ui/ProductDetailContent';
import CustomerInfoPage from './pages/CustomerInfoPage';
import CartPage from './pages/CartPage';
import PolicyPage from './pages/PolicyPage';
import FavoritesPage from './pages/FavoritesPage';
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NotificationsPage from './pages/NotificationsPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import RoleSelectPage from './pages/RoleSelectPage';

// Admin
import AdminLogin from './pages/adminPages/AdminLogin';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import ManageProducts from './pages/adminPages/ManageProducts';
import ManageOrders from './pages/adminPages/ManageOrders';
import CreateProduct from './pages/adminPages/CreateProduct';
import EditProduct from './pages/adminPages/EditProduct';
import ProductDetail from './pages/adminPages/ProductDetail';
import CustomerSummary from './pages/adminPages/CustomerSummary';
import ManageDiscounts from './pages/adminPages/ManageDiscounts';
import AdminForgotPassword from './pages/adminPages/AdminForgotPassword';
import AdminResetPassword from './pages/adminPages/AdminResetPassword';

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            {/* Entry point */}
            <Route path="/" element={<RoleSelectPage />} />

            {/* Customer */}
            <Route path="/home" element={<Home />} />
            <Route path="/AllProducts" element={<AllProductsPage />} />
            <Route path="/WomenPage" element={<WomenCategory />} />
            <Route path="/MenPage" element={<MenCategory />} />
            <Route path="/ChildrenPage" element={<ChildrenPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/customer-info" element={<CustomerInfoPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/policies/:slug" element={<PolicyPage />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/signup" element={<CustomerSignup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/products/create" element={<CreateProduct />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/customers-summary" element={<CustomerSummary />} />
            <Route path="/admin/discounts" element={<ManageDiscounts />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  );
}