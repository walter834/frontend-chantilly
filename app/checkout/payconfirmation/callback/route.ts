import { NextResponse } from 'next/server';

// Callback endpoint to receive POST from Niubiz Checkout form
export async function POST(req: Request) {
  let data: Record<string, any> = {};

  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      form.forEach((value, key) => {
        if (typeof value === 'string') {
          data[key] = value;
        } else {
          data[key] = (value as File).name;
        }
      });
    } else {
      const raw = await req.text();
      if (raw) {
        try {
          const params = new URLSearchParams(raw);
          params.forEach((v, k) => (data[k] = v));
        } catch {
          try {
            data = JSON.parse(raw);
          } catch {
            // ignore
          }
        }
      } else {
        try {
          data = await req.json();
        } catch {
          // ignore
        }
      }
    }
  } catch {
    try {
      const raw = await req.text();
      const params = new URLSearchParams(raw);
      params.forEach((v, k) => (data[k] = v));
    } catch {
      // ignore
    }
  }

  // Merge query string parameters (?a=1&b=2) into the payload as well
  try {
    const url = new URL(req.url);
    url.searchParams.forEach((v, k) => {
      if (!(k in data)) data[k] = v;
    });
  } catch {
    // ignore
  }

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Procesando pago…</title>
  </head>
  <body className="bg-[#c41c1a]">
    <script>
      try {
        var payload = ${JSON.stringify(data)};
        localStorage.setItem('lastPaymentResult', JSON.stringify(payload));
      } catch (e) {}
      window.location.replace('/checkout/payconfirmation');
    </script>
    Procesando pago…
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// Allow GET testing: visiting /callback?amount=...&currency=... will store and redirect
export async function GET(req: Request) {
  let data: Record<string, any> = {};
  try {
    const url = new URL(req.url);
    url.searchParams.forEach((v, k) => (data[k] = v));
  } catch {
    // ignore
  }

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Procesando pago…</title>
  </head>
  <body className="bg-[#c41c1a]">
    <script>
      try {
        var payload = ${JSON.stringify(data)};
        localStorage.setItem('lastPaymentResult', JSON.stringify(payload));
      } catch (e) {}
      window.location.replace('/checkout/payconfirmation');
    </script>
    Procesando pago…
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
