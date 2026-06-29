// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Shared HTML shell ────────────────────────────────────────────────────────
const wrap = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>The Three Loom</title>
</head>
<body style="margin:0;padding:0;background:#fdf6f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#FFC0CB;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">
                THE THREE LOOM
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:#7a3040;letter-spacing:2px;text-transform:uppercase;">
                Pakistani Fashion
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fdf6f8;padding:24px 40px;text-align:center;border-top:1px solid #f0e0e5;">
              <p style="margin:0;font-size:12px;color:#aaa;">
                © 2025 The Three Loom · Pakistani Fashion<br/>
                Questions? Reply to this email or WhatsApp us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ── Item rows helper ─────────────────────────────────────────────────────────
const itemRows = (items) =>
  items.map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f5e8eb;font-size:14px;color:#333;">
        ${item.name}${item.size ? ` <span style="color:#aaa;font-size:12px;">(${item.size})</span>` : ''}
        ${item.color ? ` <span style="color:#aaa;font-size:12px;">· ${item.color}</span>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f5e8eb;font-size:14px;color:#333;text-align:center;">
        × ${item.quantity}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f5e8eb;font-size:14px;color:#333;text-align:right;">
        Rs. ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>`).join('');

// ── 1. Order Confirmation ────────────────────────────────────────────────────
const sendOrderConfirmation = async (order) => {
  const shortId = order._id.toString().slice(-8).toUpperCase();
  const isOnline = order.paymentMethod === 'online';

  const paymentNote = isOnline
    ? `<div style="background:#fff8e1;border:1px solid #ffe082;border-radius:10px;padding:14px 20px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#7a5c00;">
          ⏳ <strong>Payment Under Review</strong><br/>
          Your Easypaisa/JazzCash screenshot has been received. Our team will verify your payment shortly and update your order status.
        </p>
      </div>`
    : '';

  const html = wrap(`
    <h2 style="margin:0 0 6px;font-size:22px;color:#1a1a1a;">Thank you, ${order.fullName.split(' ')[0]}! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#666;">
      Your order has been placed successfully. We'll keep you updated every step of the way.
    </p>

    <!-- Order ID badge -->
    <div style="background:#fdf6f8;border:1px solid #f0dde3;border-radius:10px;padding:14px 20px;margin-bottom:28px;display:inline-block;">
      <span style="font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Order ID</span><br/>
      <span style="font-size:18px;font-weight:700;color:#c0576a;">#${shortId}</span>
    </div>

    ${paymentNote}

    <!-- Items table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <thead>
        <tr>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:left;">Item</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:center;">Qty</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows(order.items)}
      </tbody>
    </table>

    <!-- Total -->
    <div style="text-align:right;margin-bottom:28px;">
      <span style="font-size:16px;font-weight:700;color:#1a1a1a;">
        Total: Rs. ${order.totalPrice.toLocaleString()}
      </span>
    </div>

    <!-- Delivery details -->
    <div style="background:#fdf6f8;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#c0576a;">
        Delivery Details
      </p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.8;">
        📍 ${order.address}, ${order.city}<br/>
        📞 ${order.phoneNumber}<br/>
        🚚 ${order.shippingMethod} Shipping<br/>
        💳 ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Easypaisa / JazzCash (Online)'}
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#999;line-height:1.7;">
      You can cancel your order <strong>within 24 hours</strong> for free from your Order History page.
      After 24 hours, a 20% cancellation fee applies.
    </p>
  `);

  await transporter.sendMail({
    from: `"The Three Loom" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmed #${shortId} — The Three Loom`,
    html,
  });
};

// ── 2. Status Update ─────────────────────────────────────────────────────────
const STATUS_INFO = {
  Processing: {
    emoji: '⚙️',
    headline: 'Your order is being processed!',
    body: 'Our team has confirmed your payment and is carefully preparing your order for dispatch.',
    color: '#3b82f6',
  },
  Shipped: {
    emoji: '🚚',
    headline: 'Your order is on its way!',
    body: 'Your package has been handed over to the courier. Expect delivery within 2–5 working days.',
    color: '#8b5cf6',
  },
  Delivered: {
    emoji: '✅',
    headline: 'Your order has been delivered!',
    body: 'We hope you love your new pieces. Thank you for shopping with The Three Loom!',
    color: '#22c55e',
  },
};

const sendStatusUpdate = async (order) => {
  const info = STATUS_INFO[order.status];
  if (!info) return;

  const shortId = order._id.toString().slice(-8).toUpperCase();

  const html = wrap(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:12px;">${info.emoji}</div>
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">${info.headline}</h2>
      <p style="margin:0;font-size:15px;color:#666;">${info.body}</p>
    </div>

    <div style="background:#fdf6f8;border:1px solid #f0dde3;border-radius:10px;padding:14px 20px;margin-bottom:28px;text-align:center;">
      <span style="font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Order ID</span><br/>
      <span style="font-size:18px;font-weight:700;color:#c0576a;">#${shortId}</span>
    </div>

    <!-- Items summary -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <thead>
        <tr>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:left;">Item</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:center;">Qty</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows(order.items)}
      </tbody>
    </table>

    <div style="text-align:right;margin-bottom:8px;">
      <span style="font-size:15px;font-weight:700;color:#1a1a1a;">
        Total: Rs. ${order.totalPrice.toLocaleString()}
      </span>
    </div>
  `);

  await transporter.sendMail({
    from: `"The Three Loom" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `${info.emoji} Order #${shortId} — ${order.status} · The Three Loom`,
    html,
  });
};

// ── 3. Cancellation ──────────────────────────────────────────────────────────
const sendCancellationEmail = async (order) => {
  const shortId = order._id.toString().slice(-8).toUpperCase();
  const hasPenalty = order.cancellationPenaltyApplied && order.cancellationPenalty > 0;

  const penaltyBlock = hasPenalty ? `
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:18px 20px;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:1px;">
        ⚠️ Late Cancellation Penalty
      </p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">
        This order was cancelled more than 24 hours after placement.<br/>
        A <strong>20% penalty of Rs. ${order.cancellationPenalty.toLocaleString()}</strong> applies.<br/>
        Our team will contact you on <strong>${order.phoneNumber}</strong> to arrange collection.
      </p>
    </div>` : `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 20px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#16a34a;">
        ✅ <strong>No penalty applied</strong> — cancelled within the 24-hour free window.
      </p>
    </div>`;

  const html = wrap(`
    <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">Order Cancelled</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#666;">
      Hi ${order.fullName.split(' ')[0]}, your order has been cancelled as requested.
    </p>

    <div style="background:#fdf6f8;border:1px solid #f0dde3;border-radius:10px;padding:14px 20px;margin-bottom:20px;display:inline-block;">
      <span style="font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Order ID</span><br/>
      <span style="font-size:18px;font-weight:700;color:#c0576a;">#${shortId}</span>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:left;">Item</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:center;">Qty</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows(order.items)}
      </tbody>
    </table>

    <div style="text-align:right;margin-bottom:4px;">
      <span style="font-size:15px;font-weight:700;color:#1a1a1a;">
        Order Total: Rs. ${order.totalPrice.toLocaleString()}
      </span>
    </div>

    ${penaltyBlock}

    <p style="margin:16px 0 0;font-size:13px;color:#999;">
      We'd love to have you back. Visit The Three Loom anytime to explore our latest collection.
    </p>
  `);

  await transporter.sendMail({
    from: `"The Three Loom" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Order #${shortId} Cancelled — The Three Loom`,
    html,
  });
};

// ── 4. Payment Rejected (fraud / invalid screenshot) ─────────────────────────
const sendPaymentRejectionEmail = async (order) => {
  const shortId = order._id.toString().slice(-8).toUpperCase();
  const reason = order.rejectionReason || 'Payment could not be verified.';

  const html = wrap(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:12px;">🚫</div>
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">Payment Not Verified</h2>
      <p style="margin:0;font-size:15px;color:#666;">
        Hi ${order.fullName.split(' ')[0]}, unfortunately we were unable to verify your payment for the order below.
      </p>
    </div>

    <div style="background:#fdf6f8;border:1px solid #f0dde3;border-radius:10px;padding:14px 20px;margin-bottom:24px;text-align:center;display:inline-block;width:100%;box-sizing:border-box;">
      <span style="font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Order ID</span><br/>
      <span style="font-size:18px;font-weight:700;color:#c0576a;">#${shortId}</span>
    </div>

    <!-- Rejection reason -->
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:1px;">
        ⚠️ Reason
      </p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">
        ${reason}
      </p>
    </div>

    <!-- Items summary -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <thead>
        <tr>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:left;">Item</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:center;">Qty</th>
          <th style="font-size:11px;text-transform:uppercase;color:#aaa;padding-bottom:8px;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows(order.items)}
      </tbody>
    </table>

    <div style="text-align:right;margin-bottom:24px;">
      <span style="font-size:15px;font-weight:700;color:#1a1a1a;">
        Total: Rs. ${order.totalPrice.toLocaleString()}
      </span>
    </div>

    <!-- What to do next -->
    <div style="background:#fdf6f8;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#c0576a;">
        What to do next
      </p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.8;">
        • If you believe this is a mistake, please contact us with a clear screenshot of your transaction.<br/>
        • Make sure the payment was sent to <strong>03489928595</strong> (The Three Loom).<br/>
        • You may place a new order and re-upload your payment proof.
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#999;line-height:1.7;">
      We apologise for the inconvenience. If you need assistance, please reply to this email or reach us on WhatsApp.
    </p>
  `);

  await transporter.sendMail({
    from: `"The Three Loom" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `⚠️ Payment Not Verified — Order #${shortId} · The Three Loom`,
    html,
  });
};

// ── 5. Sale Started (broadcast to all past customers) ───────────────────────
const sendSaleAnnouncementBulk = async (emails, { category, discountPercent }) => {
  const html = wrap(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:52px;margin-bottom:12px;">🎉</div>
      <h2 style="margin:0 0 8px;font-size:26px;color:#1a1a1a;font-weight:700;">
        ${discountPercent}% OFF — ${category}'s Collection!
      </h2>
      <p style="margin:0;font-size:15px;color:#666;line-height:1.7;">
        A new sale just started at The Three Loom.<br/>
        Shop the <strong>${category}</strong> collection now and save <strong>${discountPercent}%</strong> on every item.
      </p>
    </div>

    <div style="background:linear-gradient(135deg,#FFC0CB,#ffaab8);border-radius:14px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:13px;color:#7a3040;text-transform:uppercase;letter-spacing:2px;">Limited Time Offer</p>
      <p style="margin:0;font-size:48px;font-weight:900;color:#1a1a1a;">${discountPercent}% OFF</p>
      <p style="margin:4px 0 0;font-size:14px;color:#7a3040;">on all ${category} products</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="http://localhost:5173/${category}Page"
         style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
        Shop ${category}'s Sale →
      </a>
    </div>

    <p style="margin:0;font-size:12px;color:#bbb;text-align:center;">
      Sale prices apply automatically at checkout. No code needed.
    </p>
  `);

  const results = await Promise.allSettled(
    emails.map(to =>
      transporter.sendMail({
        from: `"The Three Loom" <${process.env.EMAIL_USER}>`,
        to,
        subject: `🎉 ${discountPercent}% OFF ${category}'s Collection — Shop Now!`,
        html,
      })
    )
  );

  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed > 0) console.error(`Sale announcement: ${failed}/${emails.length} emails failed`);
  console.log(`Sale announcement sent: ${emails.length - failed}/${emails.length} delivered`);
};

// ── 6. Sale Ended (broadcast to all past customers) ─────────────────────────
const sendSaleEndedBulk = async (emails, { category, discountPercent }) => {
  const html = wrap(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:12px;">🏷️</div>
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;font-weight:700;">
        The ${category}'s Sale Has Ended
      </h2>
      <p style="margin:0;font-size:15px;color:#666;line-height:1.7;">
        The <strong>${discountPercent}% discount</strong> on our ${category} collection has now ended.<br/>
        Thank you to everyone who shopped with us during the sale!
      </p>
    </div>

    <div style="background:#fdf6f8;border:1px solid #f0dde3;border-radius:12px;padding:22px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:13px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Don't miss our next sale</p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">
        Keep an eye on your inbox — we'll notify you the moment a new sale goes live.<br/>
        In the meantime, explore our full collection at regular prices.
      </p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="http://localhost:5173/${category}Page"
         style="display:inline-block;background:#FFC0CB;color:#1a1a1a;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:700;">
        Browse ${category}'s Collection →
      </a>
    </div>
  `);

  const results = await Promise.allSettled(
    emails.map(to =>
      transporter.sendMail({
        from: `"The Three Loom" <${process.env.EMAIL_USER}>`,
        to,
        subject: `The ${category}'s Sale Has Ended — The Three Loom`,
        html,
      })
    )
  );

  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed > 0) console.error(`Sale ended: ${failed}/${emails.length} emails failed`);
};

// ── 7. Admin Password Reset ───────────────────────────────────────────────────
const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = wrap(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:12px;">🔐</div>
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;font-weight:700;">Reset Your Password</h2>
      <p style="margin:0;font-size:15px;color:#666;line-height:1.7;">
        Hi ${user.name}, we received a request to reset your admin password.<br/>
        Click the button below — this link expires in <strong>30 minutes</strong>.
      </p>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${resetUrl}"
        style="display:inline-block;background:#FFC0CB;color:#1a1a1a;text-decoration:none;padding:14px 40px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
        Reset Password →
      </a>
    </div>

    <div style="background:#fdf6f8;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#888;line-height:1.7;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${resetUrl}" style="color:#c0576a;word-break:break-all;font-size:12px;">${resetUrl}</a>
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#bbb;text-align:center;line-height:1.7;">
      If you didn't request a password reset, you can safely ignore this email.<br/>
      Your password will not be changed.
    </p>
  `);

  await transporter.sendMail({
    from: `"The Three Loom Admin" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `🔐 Reset Your Admin Password — The Three Loom`,
    html,
  });
};

module.exports = {
  sendOrderConfirmation,
  sendStatusUpdate,
  sendCancellationEmail,
  sendPaymentRejectionEmail,
  sendSaleAnnouncementBulk,
  sendSaleEndedBulk,
  sendPasswordResetEmail,
};