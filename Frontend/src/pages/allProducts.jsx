import React, { useState } from 'react';
import Header from "../components/ui/Header.jsx";
import AllProducts from "../components/ui/AllProducts.jsx";
import Footer from "../components/ui/Footer.jsx";

export default function AllProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearchTerm} />
      <main className="flex-grow">
        <AllProducts searchTerm={searchTerm} />
      </main>
      <Footer />
    </div>
  );
}
