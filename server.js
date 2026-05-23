const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

// Load .env
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
});

const apiClient = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
});

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // ── API: Midtrans Snap Token ──
  if (req.method === 'POST' && pathname === '/api/midtrans/token') {
    const body = await parseBody(req);
    const orderId = `MANGACANS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const amount = parseInt(body.amount) || 10000;

    if (amount < 1000) {
      sendJSON(res, 400, { error: 'Minimal donasi Rp 1.000' });
      return;
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: body.name || 'Supporter',
        email: body.email || 'anon@mangacans.com'
      },
      item_details: [{
        id: 'SUPPORT-1',
        price: amount,
        quantity: 1,
        name: 'Dukungan untuk Mangacans'
      }]
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      sendJSON(res, 200, { token: transaction.token, redirect_url: transaction.redirect_url, order_id: orderId });
    } catch (err) {
      console.error('Midtrans token error:', err.message);
      sendJSON(res, 500, { error: 'Gagal membuat transaksi. Pastikan Midtrans key sudah benar.' });
    }
    return;
  }

  // ── API: Midtrans Notification ──
  if (req.method === 'POST' && pathname === '/api/midtrans/notification') {
    const body = await parseBody(req);
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

      sendJSON(res, 200, { status: 'ok' });
    } catch (err) {
      console.error('Webhook error:', err.message);
      sendJSON(res, 500, { error: 'Webhook processing failed' });
    }
    return;
  }

  // ── Static Files ──
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cross-Origin-Opener-Policy': 'unsafe-none',
        'Cross-Origin-Embedder-Policy': 'unsafe-none'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
