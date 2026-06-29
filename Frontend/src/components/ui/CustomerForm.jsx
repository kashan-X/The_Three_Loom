import React, { useState } from 'react';

const ACCOUNT = {
  number: '03489928595',
  name: 'The Three Loom',
};

// Step 1 = fill form
// Step 2 = show payment instructions + screenshot upload (online only)
export default function CustomerForm({ items, totalPrice, onComplete }) {
  const [step, setStep] = useState(1);

  // Form fields
  const [email,          setEmail]    = useState('');
  const [fullName,       setFullName] = useState('');
  const [phoneNumber,    setPhone]    = useState('');
  const [address,        setAddress]  = useState('');
  const [city,           setCity]     = useState('');
  const [whatsappNumber, setWhatsapp] = useState('');
  const [paymentMethod,  setPayment]  = useState('cod'); // 'cod' | 'online'

  // Screenshot (online payment only)
  const [screenshot, setScreenshot] = useState(null);
  const [preview,    setPreview]    = useState(null);

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  // Step 1 → Step 2 (for online) or directly submit (for COD)
  const handleContinue = () => {
    if (!email || !fullName || !phoneNumber || !address || !city) {
      return alert('Please fill in all required fields.');
    }
    if (!items || items.length === 0) {
      return alert('Your cart is empty.');
    }
    if (paymentMethod === 'online') {
      setStep(2); // show payment instructions
    } else {
      submitOrder(null);
    }
  };

  const submitOrder = async (screenshotFile) => {
    if (paymentMethod === 'online' && !screenshotFile) {
      return alert('Please upload your payment screenshot before submitting.');
    }
    if (!window.confirm('Are you sure you want to complete the order?')) return;

    setLoading(true);

    // Build FormData so we can send the file + JSON together
    const formData = new FormData();
    formData.append('email',          email);
    formData.append('fullName',       fullName);
    formData.append('phoneNumber',    phoneNumber);
    formData.append('address',        address);
    formData.append('city',           city);
    formData.append('whatsappNumber', whatsappNumber);
    formData.append('shippingMethod', 'Standard');
    formData.append('paymentMethod',  paymentMethod);
    formData.append('billingAddress', 'same');
    formData.append('items',          JSON.stringify(
      items.map((item) => ({
        productId: item.productId,
        size:      item.size,
        color:     item.color,
        quantity:  item.quantity,
      }))
    ));
    formData.append('totalPrice', totalPrice);
    if (screenshotFile) formData.append('paymentScreenshot', screenshotFile);

    try {
      const res  = await fetch('http://localhost:8000/order/place', {
        method: 'POST',
        body:   formData, // no Content-Type header — browser sets multipart boundary
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');

      const msg = paymentMethod === 'online'
        ? `Order placed! Your payment screenshot is under review. Confirmation sent to ${email}.`
        : `Success! Order placed. Confirmation sent to ${email}.`;
      alert(msg);
      onComplete(email);
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Payment instructions screen ──────────────────────────────────
  if (step === 2) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-2">📱</div>
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Payment</h2>
          <p className="text-gray-500 mt-1 text-sm">Send the exact amount via Easypaisa or JazzCash, then upload your screenshot below.</p>
        </div>

        {/* Account details card */}
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 space-y-3">
          <p className="text-xs font-bold text-pink-600 uppercase tracking-widest">Send Payment To</p>

          <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-pink-100">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Account / Number</p>
              <p className="text-xl font-bold tracking-widest text-gray-900">{ACCOUNT.number}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(ACCOUNT.number); alert('Number copied!'); }}
              className="text-xs text-pink-500 hover:text-pink-700 font-semibold border border-pink-200 rounded-lg px-3 py-1.5"
            >
              Copy
            </button>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-pink-100">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Account Name</p>
              <p className="text-lg font-bold text-gray-900">{ACCOUNT.name}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-pink-100">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Amount to Send</p>
              <p className="text-2xl font-bold text-green-700">Rs. {totalPrice?.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-1">
            ✅ Works with <strong>Easypaisa</strong> &amp; <strong>JazzCash</strong>. Send exact amount only.
          </p>
        </div>

        {/* Screenshot upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Payment Screenshot <span className="text-red-500">*</span>
          </label>

          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-pink-200 rounded-2xl cursor-pointer hover:bg-pink-50 transition">
            {preview ? (
              <img src={preview} alt="Screenshot preview" className="h-36 object-contain rounded-xl" />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm">Click to upload screenshot</p>
                <p className="text-xs mt-1">JPG, PNG, WEBP · Max 5 MB</p>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {preview && (
            <button
              onClick={() => { setScreenshot(null); setPreview(null); }}
              className="mt-2 text-xs text-red-400 hover:text-red-600"
            >
              Remove screenshot
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setStep(1)}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
          >
            ← Back
          </button>
          <button
            onClick={() => submitOrder(screenshot)}
            disabled={loading || !screenshot}
            style={{ backgroundColor: '#FFC0CB' }}
            className="flex-1 py-3 rounded-xl font-bold text-black hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit Order'}
          </button>
        </div>
      </div>
    );
  }

  // ── Step 1: Customer info form ────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Contact */}
      <section>
        <h2 className="text-xl font-bold mb-4">Contact</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-orange-300"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="news" className="w-4 h-4" defaultChecked />
          <label htmlFor="news" className="text-sm">Email me with news and offers</label>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Country/Region</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2" disabled>
            <option>Pakistan</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Full name</label>
          <input type="text" className="w-full border rounded-md px-3 py-2" value={fullName} onChange={e => setFullName(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone number</label>
          <input type="text" className="w-full border rounded-md px-3 py-2" value={phoneNumber} onChange={e => setPhone(e.target.value)} required />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Address</label>
          <input type="text" className="w-full border rounded-md px-3 py-2" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">City</label>
          <input type="text" className="w-full border rounded-md px-3 py-2" value={city} onChange={e => setCity(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">WhatsApp number (optional)</label>
          <input type="text" className="w-full border rounded-md px-3 py-2" value={whatsappNumber} onChange={e => setWhatsapp(e.target.value)} />
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

        {/* Payment method */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2">Payment</h3>
          <p className="text-sm text-gray-500 mb-3">All transactions are secure and encrypted.</p>

          <div className="space-y-3">
            {/* COD */}
            <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition ${paymentMethod === 'cod' ? 'border-pink-300 bg-pink-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPayment('cod')}
                className="w-4 h-4"
              />
              <div>
                <p className="font-medium">Cash on Delivery (COD)</p>
                <p className="text-xs text-gray-500">Pay when your order arrives</p>
              </div>
            </label>

            {/* Online */}
            <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition ${paymentMethod === 'online' ? 'border-pink-300 bg-pink-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={() => setPayment('online')}
                className="w-4 h-4"
              />
              <div>
                <p className="font-medium">Easypaisa / JazzCash</p>
                <p className="text-xs text-gray-500">Pay online and upload your screenshot</p>
              </div>
            </label>
          </div>
        </div>

        {/* Billing */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2">Billing address</h3>
          <div className="p-3 border rounded-md bg-gray-50 flex items-center gap-3">
            <input type="radio" name="billing" className="w-4 h-4" checked readOnly />
            <p className="font-medium">Same as shipping address</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        style={{ backgroundColor: '#FFC0CB' }}
        className="w-full mt-6 py-3 text-black font-bold rounded-md hover:opacity-90 disabled:opacity-50"
      >
        {paymentMethod === 'online' ? 'Continue to Payment →' : 'Complete Order'}
      </button>
    </div>
  );
}