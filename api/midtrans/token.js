const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, name, email } = req.body || {};
  const numericAmount = parseInt(amount) || 10000;

  if (numericAmount < 1000) {
    return res.status(400).json({ error: 'Minimal donasi Rp 1.000' });
  }

  const orderId = `MANGACANS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: numericAmount
    },
    credit_card: { secure: true },
    customer_details: {
      first_name: name || 'Supporter',
      email: email || 'anon@mangacans.com'
    },
    item_details: [{
      id: 'SUPPORT-1',
      price: numericAmount,
      quantity: 1,
      name: 'Dukungan untuk Mangacans'
    }]
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId
    });
  } catch (err) {
    console.error('Midtrans token error:', err.message);
    return res.status(500).json({ error: 'Gagal membuat transaksi. Pastikan Midtrans key sudah benar.' });
  }
};
