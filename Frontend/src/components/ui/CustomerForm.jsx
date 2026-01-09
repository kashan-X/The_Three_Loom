import React, { useState } from 'react';

export default function CustomerForm({ productInfo, onComplete }) {
  // ──────────────── form state ────────────────
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [whatsappNumber, setWhatsapp] = useState('');
  const [paymentMethod, setPayment] = useState('payfast');
  const [billingAddress, setBilling] = useState('same');
  const [loading, setLoading] = useState(false);

  // ─────────────── submit handler ─────────────
  const handleSubmit = async () => {
    if (!email || !fullName || !phoneNumber || !address || !city) {
      return alert('Please fill in all required fields.');
    }
    if (!window.confirm('Are you sure you want to complete the order?')) return;

    setLoading(true);

    const payload = {
      email,
      fullName,
      phoneNumber,
      address,
      city,
      whatsappNumber,
      shippingMethod: 'Standard',
      paymentMethod,
      billingAddress,
      productId: productInfo.id,
      quantity: productInfo.quantity,
      totalPrice: productInfo.totalPrice
    };

    try {
      const res = await fetch('http://localhost:8000/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');

      alert(`Success! Order placed. Confirmation sent to ${email}.`);
      onComplete(email); // parent handles success UI
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────── UI ──────────────────────
  return (
    <div className="space-y-8">
      {/* ── Contact ──────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold mb-4">Contact</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-orange-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="news" className="w-4 h-4" defaultChecked />
          <label htmlFor="news" className="text-sm">Email me with news and offers</label>
        </div>
      </section>

      {/* ── Delivery & Payment Form ───────────── */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Country */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Country/Region</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2" disabled>
            <option>Pakistan</option>
          </select>
        </div>

        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full name</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone number</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block mb-1 font-medium">WhatsApp number (optional)</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={whatsappNumber}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        {/* Shipping */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2">Shipping method</h3>
          <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
            <div className="flex items-center gap-3">
              <input type="radio" name="shipping" className="w-4 h-4" checked readOnly />
              <p className="font-medium">Standard</p>
            </div>
            <p className="font-medium">Rs 200.00</p>
          </div>
        </div>

        {/* Payment */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2">Payment</h3>
          <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
          <div className="p-3 border rounded-md bg-gray-50 flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              checked
              readOnly
            />
            <p className="font-medium">Cash on Delivery (COD)</p>
          </div>
        </div>

        {/* Billing Address */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2">Billing address</h3>
          <div className="p-3 border rounded-md bg-gray-50 flex items-center gap-3">
            <input
              type="radio"
              name="billing"
              className="w-4 h-4"
              checked
              readOnly
            />
            <p className="font-medium">Same as shipping address</p>
          </div>
        </div>

      </form>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ backgroundColor: '#FFC0CB' }}
        className="w-full mt-6 py-3 text-black font-bold rounded-md hover:bg-pink-600 disabled:opacity-50"
      >
        {loading ? 'Placing Order…' : 'Complete Order'}
      </button>
    </div>
  );
}
