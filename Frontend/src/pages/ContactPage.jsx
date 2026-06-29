import React, { useState } from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send message.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-20 flex-grow">

        {/* Heading */}

        <div className="text-center mb-16">

          <p className="uppercase tracking-[8px] text-sm text-[#FFC0CB] font-semibold">
            Contact
          </p>

          <h1 className="text-4xl  text-gray-900 mt-3">
            We'd Love to Hear From You
          </h1>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto text-lg">
            Have questions about an order, our collections, or need styling
            assistance? Our team is here to help.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT SIDE */}

          <div className="space-y-6">

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

              <div className="flex items-start gap-5">

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "#FFF1F5" }}
                >
                  <FiMail
                    size={24}
                    color="#e91e63"
                  />
                </div>

                <div>

                  <h3 className="font-semibold text-xl">
                    Email
                  </h3>

                  <p className="text-gray-500 mt-2">
                    We usually reply within 24 hours.
                  </p>

                  <a
                    href="mailto:kashankarim12@gmail.com"
                    className="mt-3 block font-medium hover:underline"
                  >
                    kashankarim12@gmail.com
                  </a>

                </div>

              </div>

            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

              <div className="flex items-start gap-5">

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "#FFF1F5" }}
                >
                  <FiPhone
                    size={24}
                    color="#e91e63"
                  />
                </div>

                <div>

                  <h3 className="font-semibold text-xl">
                    Phone
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Monday – Saturday (10 AM – 8 PM)
                  </p>

                  <a
                    href="tel:+923489928595"
                    className="mt-3 block font-medium hover:underline"
                  >
                    +92 348 9928595
                  </a>

                </div>

              </div>

            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

              <div className="flex items-start gap-5">

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "#FFF1F5" }}
                >
                  <FiMapPin
                    size={24}
                    color="#e91e63"
                  />
                </div>

                <div>

                  <h3 className="font-semibold text-xl">
                    Address
                  </h3>

                  <p className="text-gray-500 mt-2">
                    The Three Loom
                  </p>

                  <p className="mt-3 font-medium">
                    Islamabad, Pakistan
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10">

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Send us a Message
            </h2>

            <p className="text-gray-500 mb-8">
              Fill out the form below and we'll respond as soon as possible.
            </p>

            {submitted ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-700">
                <h3 className="font-semibold text-lg">
                  Thank you!
                </h3>

                <p className="mt-2">
                  Your message has been received. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
                    {error}
                  </div>
                )}

                <div>

                  <label className="block font-medium mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#FFC0CB]"
                  />

                </div>

                <div>

                  <label className="block font-medium mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#FFC0CB]"
                  />

                </div>

                <div>

                  <label className="block font-medium mb-2">
                    Message
                  </label>

                  <textarea
                    rows={6}
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:border-[#FFC0CB]"
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#FFC0CB" }}
                  className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition disabled:opacity-60"
                >
                  <FiSend />

                  {loading ? "Sending..." : "Send Message"}
                </button>

              </form>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}