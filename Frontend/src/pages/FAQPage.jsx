import React, { useState } from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { FiPlus, FiMinus, FiHelpCircle } from "react-icons/fi";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery across Pakistan usually takes 3–5 business days after your order has been confirmed. Delivery times may vary slightly during public holidays, sale events, or due to unforeseen courier delays.",
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes. Cash on Delivery (COD) is available throughout Pakistan and is our primary payment method. Simply pay the courier when your order arrives.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "Absolutely. If you receive a damaged, defective, or incorrect item, please contact our support team within 7 days of receiving your order. Our team will guide you through the exchange or return process.",
  },
  {
    q: "How do I track my order?",
    a: "Customers with an account can monitor their order progress from the Order History section. We are also working on SMS and email tracking notifications for a better shopping experience.",
  },
  {
    q: "Do I need to create an account to place an order?",
    a: "No. You may place your order as a guest using only your delivery information. Creating an account simply provides additional benefits like order history and faster checkout.",
  },
  {
    q: "What sizes are available?",
    a: "Available sizes differ depending on the product. Every product page displays the sizes currently in stock. If you're unsure about sizing, please refer to our Size Chart or contact our support team.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can usually be cancelled before they have been shipped. Once dispatched, cancellation may no longer be possible. Please contact us as soon as possible if you wish to cancel.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can reach us anytime through the Contact Us page, by email, or by phone. Our support team aims to respond within 24 hours on business days.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Header />

      <main className="flex-grow">

        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">

            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#FFE4EC" }}
            >
              <FiHelpCircle
                size={30}
                style={{ color: "#e77fa1" }}
              />
            </div>

            <h1 className="text-3xl text-gray-900">
              Frequently Asked Questions
            </h1>

            <p className="mt-5 text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Find quick answers to the most commonly asked questions about
              shopping, orders, delivery, exchanges and payments at
              <span className="font-semibold"> The Three Loom.</span>
            </p>

          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-14">

          <div className="space-y-5">

            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-lg"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between px-7 py-6 text-left"
                >
                  <span className="text-lg font-semibold text-gray-800 pr-6">
                    {faq.q}
                  </span>

                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition"
                    style={{
                      backgroundColor:
                        openIndex === index ? "#FFC0CB" : "#F5F5F5",
                    }}
                  >
                    {openIndex === index ? (
                      <FiMinus className="text-black" size={18} />
                    ) : (
                      <FiPlus className="text-gray-600" size={18} />
                    )}
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-7 pb-6 text-gray-600 leading-8 border-t border-gray-100">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Bottom Card */}

          <div
            className="mt-14 rounded-3xl p-10 text-center border"
            style={{
              backgroundColor: "#FFF7FA",
              borderColor: "#FFD6E4",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Still have questions?
            </h2>

            <p className="text-gray-600 mt-3 leading-7 max-w-xl mx-auto">
              If you couldn't find the answer you're looking for, our customer
              support team is always happy to help. We'd love to hear from you.
            </p>

            <a
              href="/contact"
              className="inline-block mt-8 px-8 py-3 rounded-full font-semibold text-black transition hover:opacity-90"
              style={{ backgroundColor: "#FFC0CB" }}
            >
              Contact Support
            </a>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}