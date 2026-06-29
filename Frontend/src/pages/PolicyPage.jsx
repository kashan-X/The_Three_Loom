import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const POLICY_CONTENT = {
  shipping: {
    title: 'Shipping Info',
    body: 'We currently offer standard shipping across Pakistan. Delivery typically takes 3–5 business days. Full shipping details will be published here soon.'
  },
  returns: {
    title: 'Returns & Exchanges',
    body: 'We want you to love what you order. Our full returns and exchange policy will be published here soon — for now, please contact us directly for any return requests.'
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'We respect your privacy and only use your information to process orders and improve your shopping experience. A full privacy policy will be published here soon.'
  },
  terms: {
    title: 'Terms of Service',
    body: 'By using this site, you agree to our terms of service. A full terms document will be published here soon.'
  }
};

export default function PolicyPage() {
  const { slug } = useParams();
  const content = POLICY_CONTENT[slug] || {
    title: 'Page Not Found',
    body: 'This page is not available yet.'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
        <p className="text-gray-700 leading-relaxed">{content.body}</p>
      </main>
      <Footer />
    </div>
  );
}