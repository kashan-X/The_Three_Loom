import React from 'react';
import Header from "../components/ui/Header.jsx";
import Hero from "../components/ui/Hero.jsx";
import Footer from "../components/ui/Footer.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
