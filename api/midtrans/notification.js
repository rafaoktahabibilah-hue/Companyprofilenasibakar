const midtransClient = require('midtrans-client');

const apiClient = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  console.log('Midtrans notification:', JSON.stringify(body));

  try {
    const statusResponse = await apiClient.transaction.notification(body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Order ${orderId}: ${transactionStatus}, fraud: ${fraudStatus}`);

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      console.log(`Payment SUCCESS for order ${orderId}, amount: ${statusResponse.gross_amount}`);
    } else if (transactionStatus === 'pending') {
      console.log(`Payment PENDING for order ${orderId}`);
    } else {
      console.log(`Payment FAILED/DENIED for order ${orderId}`);
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};
