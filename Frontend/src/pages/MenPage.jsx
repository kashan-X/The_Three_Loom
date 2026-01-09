// pages/ChildrenPage.jsx
import React, { useState } from 'react';
import Header from "../components/ui/Header.jsx";
import CategoryProducts from "../components/ui/CategoryProducts.jsx";
import Footer from "../components/ui/Footer.jsx";

function MenPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <CategoryProducts searchTerm={searchTerm} category="Men" />
      </main>

      <Footer />
    </div>
  );
}

export default MenPage;
