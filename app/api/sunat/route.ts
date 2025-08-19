import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ruc = searchParams.get('ruc');

    if (!ruc) {
      return NextResponse.json({ success: false, msg: 'Falta el parámetro ruc' }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_API_SUNAT || process.env.API_SUNAT || '';
    if (!base) {
      return NextResponse.json({ success: false, msg: 'API_SUNAT no configurada en variables de entorno' }, { status: 500 });
    }

    const targetUrl = new URL(`${base}${ruc}`);

    // Importante: no enviar headers innecesarios que disparen preflight
    const resp = await fetch(targetUrl.toString(), {
      method: 'GET',
      // Evitar reenviar headers que causen CORS; Next.js fetch en server no está limitado por CORS del navegador
      // cache: 'no-store' // descomenta si quieres evitar cache en Vercel
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.ok ? 200 : resp.status });
  } catch (err: any) {
    console.error('SUNAT proxy error:', err);
    return NextResponse.json({ success: false, msg: 'Error consultando servicio SUNAT' }, { status: 500 });
  }
}
